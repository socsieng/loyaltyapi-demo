import express from 'express';
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
import { loyaltyRoutes } from './loyalty';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routers = {
  '/loyalty': loyaltyRoutes,
};

// register apis with an additional /api path
Object.entries(routers).forEach(([path, router]) => {
  app.use(path, router);

  // also register the /api prefix for rewrites
  app.use(`/api${path}`, router);
});

export const api = functions.https.onRequest(app);
