import { Request, Response, NextFunction } from 'express';
import { searchAnime } from '../services/jikanService';
import logger from '../utils/logger';
import { AnimeSearchParams } from '../types/anime';

export async function searchAnimeController(req: Request, res: Response, next: NextFunction) {
  try {
    const searchParams: AnimeSearchParams = {
      query: req.query.query as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      type: req.query.type as string | undefined,
      score: req.query.score ? parseFloat(req.query.score as string) : undefined,
      status: req.query.status as string | undefined,
      rating: req.query.rating as string | undefined,
      genres: req.query.genres as string | undefined,
      order_by: req.query.order_by as string | undefined,
      sort: req.query.sort as 'asc' | 'desc' | undefined,
    };

    const results = await searchAnime(searchParams);
    logger.info(`Search completed for query: ${searchParams.query}`);
    res.json(results);
  } catch (error) {
    next(error);
  }
}