import { Router } from 'express';
import { scrapeAnime } from '../controllers/animeController';
import { searchAnimeController } from '../controllers/searchController';
import { getTimemapController } from '../controllers/archiveController';
import { validateRequest } from '../middleware/validateRequest';
import { scrapeAnimeSchema, searchAnimeSchema, timemapSchema } from '../utils/validationSchemas';

const router = Router();

/**
 * @openapi
 * /anime:
 *   get:
 *     summary: Search for anime titles
 *     tags: [Anime]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimeSearchResult'
 */
router.get('/anime', validateRequest(searchAnimeSchema), searchAnimeController);

/**
 * @openapi
 * /anime/historical:
 *   get:
 *     summary: Get historical anime data
 *     tags: [Anime]
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoricalAnimeData'
 */
router.get('/anime/historical', validateRequest(scrapeAnimeSchema), scrapeAnime);

/**
 * @openapi
 * /anime/timemap:
 *   get:
 *     summary: Get timemap for an anime URL
 *     description: Retrieve the list of available timestamps for a given anime URL
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The MyAnimeList URL of the anime
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering timestamps (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering timestamps (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimemapResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/anime/timemap', validateRequest(timemapSchema), getTimemapController);

export default router;