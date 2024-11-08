import { Request, Response, NextFunction } from 'express';
import { scrapeAnimeData } from '../services/animeService';
import { ScrapeAnimeRequest, ScrapeAnimeResponse } from '../types/anime';
import logger from '../utils/logger';

export async function scrapeAnime(req: Request<{}, {}, ScrapeAnimeRequest>, res: Response<ScrapeAnimeResponse>, next: NextFunction) {
  const { url, date } = req.query;
  logger.info(`Scrape anime request received for URL: ${url}, Date: ${date || 'latest'}`);
  
  try {
    logger.debug('Calling scrapeAnimeData service');
    const result = await scrapeAnimeData(url, date);
    logger.info(`Scrape anime successful for URL: ${url}`);
    logger.debug(`Scrape result: ${JSON.stringify(result)}`);
    res.json(result);
  } catch (error) {
    logger.error(`Error in scrapeAnime controller: ${error instanceof Error ? error.message : String(error)}`);
    next(error);
  }
}