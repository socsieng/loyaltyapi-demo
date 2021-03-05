const express = require('express');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const { loyaltyRoutes } = require('./loyalty');

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

exports.api = functions.https.onRequest(app);
