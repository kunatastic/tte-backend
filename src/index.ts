/**
 * SETUP .env GLOBAL VARIABLES
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/**
 * IMPORT PACKAGES
 */
import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import moongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rootRouter from './routes/api.routes';
import fs from 'fs';
import SwaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app: Application = express();

function loadYaml() {
  try {
    const YamlDirectory = path.join(__dirname, 'docs', 'swagger.yaml');
    const swaggerDocument = fs.readFileSync(YamlDirectory, 'utf8');
    return YAML.parse(swaggerDocument);
  } catch (err) {
    console.error(err);
  }
}

/**
 * DB CONNECTION
 */
moongoose.connect(process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017/tte', {}, () =>
  console.log('Connected to mongoDB'),
);

/**
 * MIDDLEWARES
 */
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use('/api', rootRouter);
app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(loadYaml()));

/**
 * INITIALIZE SERVER
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
