import { Request, Response, NextFunction } from 'express';
import { getTimemap } from '../services/archiveService';
import { TimemapParams } from '../types/archive';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';

export async function getTimemapController(req: Request, res: Response, next: NextFunction) {
  try {
    const params: TimemapParams = {
      url: req.query.url as string,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
    };

    if (!params.url) {
      throw new CustomError('URL parameter is required', 400);
    }

    logger.info(`Fetching timemap for URL: ${params.url}`);
    const timemap = await getTimemap(params);
    logger.info(`Timemap fetched successfully for URL: ${params.url}`);
    
    res.json({ timemap });
  } catch (error) {
    if (error instanceof CustomError) {
      logger.error(`Error in getTimemapController: ${error.message}`);
      next(error);
    } else {
      logger.error(`Unexpected error in getTimemapController: ${error}`);
      next(new CustomError('Internal server error', 500));
    }
  }
}