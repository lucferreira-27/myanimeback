import axios from 'axios';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';
import { AppDataSource } from '../config/database';
import { Anime } from '../entities/Anime';

const MAL_API_URL = 'https://api.myanimelist.net/v2';
const MAL_CLIENT_ID = process.env.MAL_CLIENT_ID;

if (!MAL_CLIENT_ID) {
  throw new Error('MAL_CLIENT_ID is not set in the environment variables');
}

export interface AnimeSearchResult {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  synopsis: string;
  mean: number;
  rank: number;
}

export async function searchAnime(query: string, limit: number = 10): Promise<AnimeSearchResult[]> {
  try {
    const response = await axios.get(`${MAL_API_URL}/anime`, {
      params: {
        q: query,
        limit: limit,
        fields: 'id,title,main_picture,synopsis,mean,rank'
      },
      headers: {
        'X-MAL-CLIENT-ID': MAL_CLIENT_ID
      }
    });

    logger.info(`Successfully fetched anime search results for query: ${query}`);
    const results = response.data.data.map((item: any) => item.node);

    // Save results to database
    const animeRepository = AppDataSource.getRepository(Anime);
    for (const result of results) {
      const anime = animeRepository.create(result);
      await animeRepository.save(anime);
    }

    return results;
  } catch (error) {
    logger.error(`Error searching anime: ${error}`);
    if (axios.isAxiosError(error) && error.response) {
      throw new CustomError(`MyAnimeList API error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
    }
    throw new CustomError('Failed to search anime', 500);
  }
}