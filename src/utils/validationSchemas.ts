import Joi from 'joi';

export const scrapeAnimeSchema = Joi.object({
  url: Joi.string().uri().required(),
  date: Joi.string().isoDate().optional(),
});

export const searchAnimeSchema = Joi.object({
  query: Joi.string().required(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  type: Joi.string().valid('tv', 'movie', 'ova', 'special', 'ona', 'music').optional(),
  score: Joi.number().min(0).max(10).optional(),
  status: Joi.string().valid('airing', 'complete', 'upcoming').optional(),
  rating: Joi.string().valid('g', 'pg', 'pg13', 'r17', 'r', 'rx').optional(),
  genres: Joi.string().optional(),
  order_by: Joi.string().valid('title', 'type', 'rating', 'start_date', 'end_date', 'episodes', 'score', 'scored_by', 'rank', 'popularity', 'members', 'favorites').optional(),
  sort: Joi.string().valid('asc', 'desc').optional(),
});

export const timemapSchema = Joi.object({
  url: Joi.string().uri().required(),
  from: Joi.string().isoDate().optional(),
  to: Joi.string().isoDate().optional(),
});