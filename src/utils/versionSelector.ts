import * as fs from 'fs';
import * as path from 'path';
import { CustomError } from './customError';
import logger from './logger';

const versionsPath = path.join(__dirname, '..', '..', 'config', 'versions');

function getVersions(): string[] {
  logger.debug(`Reading versions from directory: ${versionsPath}`);
  try {
    const versions = fs.readdirSync(versionsPath)
      .filter(file => file.startsWith('v-') && file.endsWith('.json'))
      .map(file => file.slice(0, -5)); // Remove .json extension
    logger.debug(`Found versions: ${versions.join(', ')}`);
    return versions;
  } catch (error) {
    logger.error(`Error reading versions directory: ${error}`);
    return [];
  }
}

export function selectVersion(archiveDate: string): string {
  logger.info(`Selecting version for archive date: ${archiveDate}`);
  const versions = getVersions()
    .filter(v => v !== 'v-latest')
    .sort((a, b) => {
      const dateA = new Date(a.slice(2)); 
      const dateB = new Date(b.slice(2));
      return dateB.getTime() - dateA.getTime();
    });

  const archiveDateObj = new Date(archiveDate);

  for (const version of versions) {
    const versionDate = new Date(version.slice(2)); 
    if (archiveDateObj >= versionDate) {
      logger.info(`Selected version: ${version}`);
      return version;
    }
  }

  logger.info('No specific version found, using latest');
  return 'v-latest';
}

export function loadParsingRules(version: string): any {
  const configPath = path.join(versionsPath, `${version}.json`);
  logger.debug(`Loading parsing rules from: ${configPath}`);
  
  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    const rules = JSON.parse(configFile);
    logger.debug(`Parsing rules loaded successfully for version: ${version}`);
    return rules;
  } catch (error) {
    logger.error(`Error loading parsing rules: ${error}`);
    throw new CustomError('Failed to load parsing rules', 500);
  }
}