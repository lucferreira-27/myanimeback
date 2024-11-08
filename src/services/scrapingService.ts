import * as cheerio from 'cheerio';
import { selectVersion, loadParsingRules } from '../utils/versionSelector';
import { AnimeData } from '../types/anime';
import logger from '../utils/logger';

function extractStatistic(html: string, selector: string): string {
  logger.debug(`Extracting statistic with selector: ${selector}`);
  const $ = cheerio.load(html);
  const element = $(selector);
  if (element.length === 0) {
    logger.debug(`No element found for selector: ${selector}`);
    return '';
  }
  const text = element.text().trim();
  const [, value] = text.split(':');
  const result = value ? value.trim().replace(/[#,]/g, '') : '';
  logger.debug(`Extracted statistic: ${result}`);
  return result;
}

export function scrapeAnimePage(url: string, html: string, archiveDate: string = 'latest'): AnimeData {
  logger.info(`Scraping anime page for URL: ${url}, Archive Date: ${archiveDate}`);
  try {
    const $ = cheerio.load(html);
    const version = selectVersion(archiveDate);
    logger.debug(`Selected version: ${version}`);
    const rules = loadParsingRules(version);
    logger.debug(`Loaded parsing rules for version: ${version}`);
    
    const title = $(rules.title).text().trim();
    const synopsis = $(rules.synopsis).text().trim();
    
    const score = $(rules.score).first().text().trim();
    const scoredBy = $(rules.scoredBy).text().trim().replace(',', '');
    
    const ranked = $(rules.ranked).text().match(/Ranked:\s*#(\d+)/)?.[1] || '';
    const popularity = extractStatistic(html, rules.popularity);
    const members = extractStatistic(html, rules.members);
    const favorites = extractStatistic(html, rules.favorites);

    const type = $(rules.type).text().trim();
    const season = $(rules.season).text().trim();

    const animeData: AnimeData = {
      title,
      synopsis,
      score,
      scoredBy,
      ranked,
      popularity,
      members,
      favorites,
      type,
      season
    };

    logger.info(`Successfully scraped anime data for URL: ${url}`);
    logger.debug(`Scraped anime data: ${JSON.stringify(animeData)}`);
    return animeData;
  } catch (error) {
    logger.error(`Error scraping anime page: ${error}`);
    throw new Error(`Failed to scrape anime page: ${error instanceof Error ? error.message : String(error)}`);
  }
}