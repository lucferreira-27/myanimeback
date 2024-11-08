import axios from 'axios';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';
import { AnimeSearchParams, AnimeSearchResult } from '../types/anime';
import { findAnimeInDb, saveAnimeToDb } from './animeDbService';

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

export async function searchAnime(params: AnimeSearchParams): Promise<AnimeSearchResult[]> {
  try {
    // First, check the database
    const dbResults = await findAnimeInDb(params.query);
    if (dbResults.length > 0) {
      logger.info(`Found ${dbResults.length} results in database for query: ${params.query}`);
      return dbResults;
    }

    // If not found in database, fetch from API
    const response = await axios.get(`${JIKAN_API_URL}/anime`, {
      params: {
        q: params.query,
        page: params.page,
        limit: params.limit,
        type: params.type,
        score: params.score,
        status: params.status,
        rating: params.rating,
        genres: params.genres,
        order_by: params.order_by,
        sort: params.sort,
      }
    });

    logger.info(`Successfully fetched anime search results from API for query: ${params.query}`);
    const results: AnimeSearchResult[] = response.data.data;

    // Save results to database
    for (const result of results) {
      await saveAnimeToDb(result);
    }

    return results;
  } catch (error) {
    logger.error(`Error searching anime: ${error}`);
    if (axios.isAxiosError(error) && error.response) {
      throw new CustomError(`Jikan API error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
    }
    throw new CustomError('Failed to search anime', 500);
  }
}