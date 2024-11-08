import { retrieveArchive } from './archiveService';
import { scrapeAnimePage } from './scrapingService';
import { ScrapeAnimeResponse } from '../types/anime';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';

export async function scrapeAnimeData(url: string, date: string = 'latest'): Promise<ScrapeAnimeResponse> {
  logger.info(`Scraping anime data for URL: ${url}, Date: ${date}`);
  try {
    const archivedData = await retrieveArchive(url, date);
    logger.debug(`Archive retrieved, timestamp: ${archivedData.timestamp}`);

    const animeData = scrapeAnimePage(url, archivedData.html, date);
    logger.debug(`Anime data scraped: ${JSON.stringify(animeData)}`);
    
    const { html, ...archiveDataWithoutHtml } = archivedData;

    return {
      archive: {
        archiveData: archiveDataWithoutHtml,
        animeData,
      }
    };
  } catch (error) {
    logger.error(`Failed to scrape anime data: ${error instanceof Error ? error.message : String(error)}`);
    throw new CustomError(`Failed to scrape anime data: ${error instanceof Error ? error.message : String(error)}`, 500);
  }
}