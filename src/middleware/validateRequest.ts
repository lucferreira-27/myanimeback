import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    console.log(`validateRequest called, ${JSON.stringify(dataToValidate)}`);
    logger.debug(`Validating request data: ${JSON.stringify(dataToValidate)}`);
    const { error } = schema.validate(dataToValidate);
    if (error) {
      logger.info(`Request validation failed: ${error.details[0].message}`);
      throw new CustomError(error.details[0].message, 400);
    }
    logger.debug('Request validation successful');
    next();
  };
};