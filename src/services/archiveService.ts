import axios, { AxiosError, AxiosResponse } from 'axios';
import { TimemapEntry, ArchiveResponse, TimemapParams } from '../types/archive';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

function handleAxiosError(error: AxiosError): never {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          throw new CustomError('Bad request: The server cannot process the request', status);
        case HTTP_STATUS.UNAUTHORIZED:
          throw new CustomError('Unauthorized: Authentication is required', status);
        case HTTP_STATUS.FORBIDDEN:
          throw new CustomError('Forbidden: You don\'t have permission to access this resource', status);
        case HTTP_STATUS.NOT_FOUND:
          throw new CustomError('Not found: The requested resource does not exist', status);
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          throw new CustomError('Too many requests: Please try again later', status);
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          throw new CustomError('Internal server error: Something went wrong on the server', status);
        default:
          throw new CustomError(`Unexpected error: ${error.message}`, status);
      }
    }
    throw new CustomError(`${error.message}`, 500);
  }

function responseToTimemapEntry(response: AxiosResponse<any, any>): TimemapEntry[] {
  logger.debug('Converting response to TimemapEntry');
  const data = response.data as string[][];
  return data.slice(1).map(entry => ({
    timestamp: entry[1],
    archiveUrl: entry[2]
  }));
}

function buildArchiveUrl(timestamp: string, originalUrl: string): string {
  const archiveUrl = `https://web.archive.org/web/${timestamp}/${originalUrl}`;
  logger.debug(`Built archive URL: ${archiveUrl}`);
  return archiveUrl;
}

export async function getAvailableTimestamps(url: string): Promise<TimemapEntry[]> {
  const timemapUrl = `https://web.archive.org/web/timemap/json?url=${encodeURIComponent(url)}`;
  logger.debug(`Fetching timestamps from: ${timemapUrl}`);
  try {
    const response = await axios.get(timemapUrl);
    if (!response.data || response.status != 200) {
      console.log(response.data);
    }
    logger.info(`Successfully fetched timestamps for URL: ${url}`);
    return responseToTimemapEntry(response);
  } catch (error) {
    if(error instanceof CustomError) {
      logger.error(`Error fetching timestamps: ${error}`);
      throw error;
    }
    logger.error(`Error fetching timestamps: ${error}`);
    handleAxiosError(error as AxiosError);
  }
}

export function selectTimestamp(entries: TimemapEntry[], targetDate: string): TimemapEntry {
  logger.debug(`Selecting timestamp for target date: ${targetDate}`);
  const targetTimestamp = targetDate === 'latest' ? '99999999999999' : targetDate.replace(/\D/g, '');
  
  const selectedEntry = entries
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .find(entry => entry.timestamp <= targetTimestamp);

  if (!selectedEntry) {
    logger.error(`No suitable archive found for the given date: ${targetDate}`);
    throw new CustomError('No suitable archive found for the given date', 404);
  }
  selectedEntry.archiveUrl = buildArchiveUrl(selectedEntry.timestamp, selectedEntry.archiveUrl);
  logger.info(`Selected timestamp: ${selectedEntry.timestamp}`);

  return selectedEntry;
}


async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<AxiosResponse> {
  try {
    return await axios.get(url);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === HTTP_STATUS.TOO_MANY_REQUESTS && retries > 0) {
      const delay = INITIAL_RETRY_DELAY * (MAX_RETRIES - retries + 1);
      logger.warn(`Rate limited. Retrying in ${delay}ms. Retries left: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function retrieveArchive(url: string, date: string): Promise<ArchiveResponse> {
  logger.info(`Retrieving archive for URL: ${url}, Date: ${date}`);
  try {
    const entries = await getAvailableTimestamps(url);
    logger.debug(`Retrieved ${entries.length} timestamp entries`);
    const selectedEntry = selectTimestamp(entries, date);
    logger.debug(`Fetching archive content from: ${selectedEntry.archiveUrl}`);
    
    const response = await fetchWithRetry(selectedEntry.archiveUrl);
    
    logger.info(`Successfully retrieved archive for URL: ${url}`);
    return {
      timestamp: selectedEntry.timestamp,
      archiveUrl: selectedEntry.archiveUrl,
      html: response.data
    };
  } catch (error) {
    if(error instanceof CustomError) {
      logger.error(`Error retrieving archive: ${error}`);
      throw error;
    }
    logger.error(`Error retrieving archive: ${error}`);
    handleAxiosError(error as AxiosError);
  }
}

export async function getTimemap(params: TimemapParams): Promise<TimemapEntry[]> {
  try {
    const entries = await getAvailableTimestamps(params.url);
    
    let filteredEntries = entries;
    if (params.from) {
      const fromDate = new Date(params.from);
      filteredEntries = filteredEntries.filter(entry => new Date(entry.timestamp) >= fromDate);
    }
    if (params.to) {
      const toDate = new Date(params.to);
      filteredEntries = filteredEntries.filter(entry => new Date(entry.timestamp) <= toDate);
    }

    return filteredEntries;
  } catch (error) {
    logger.error(`Error fetching timemap: ${error}`);
    if (axios.isAxiosError(error) && error.response) {
      throw new CustomError(`Archive.org API error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
    }
    throw new CustomError('Failed to fetch timemap', 500);
  }
}