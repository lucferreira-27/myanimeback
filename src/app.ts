import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import "reflect-metadata";

import config from './config';
import animeRoutes from './routes/animeRoutes';
import logger from './utils/logger';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { CustomError } from './utils/customError';

const app = express();

app.use(express.json());

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Serve OpenAPI UI
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirect root to API documentation
app.get('/', (_, res) => res.redirect('/api/v1/docs'));

// API routes
app.use('/api/v1', animeRoutes);

// Add this near the top with other middleware
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new CustomError(`${req.method} ${req.path} does not exist`, 404));
});

// Error handling middleware
// @ts-ignore
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
    app.listen(config.port, () => {
      logger.info(`Server running at http://localhost:${config.port}`);
      logger.info(`API documentation available at http://localhost:${config.port}/v1/docs`);
    });
  })
  .catch((err: Error) => {
    logger.error("Error during Data Source initialization:", err);
  });

export default app;