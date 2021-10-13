/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const config = require('./config');
const { createLoyaltyObject, updateLoyaltyPoints, getLoyaltyId } = require('./services/loyalty-service');

// eslint-disable-next-line new-cap
const router = express.Router();

// Register API routes (prefix: /api/loyalty)
router.post('/sign-up', asyncHandler(signUp));
router.post('/sign-in', asyncHandler(signIn));
router.post('/create', asyncHandler(createAccount));
router.post('/:memberId/points', asyncHandler(updatePoints));

/**
 * Handles the sign-up request from Google Pay Enrollment and Sign up
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function signUp(req, res) {
  const { userProfile } = req.body;
  const jwt = JSON.parse(Buffer.from(userProfile, 'base64').toString('utf8'));
  const { firstName, lastName, email } = jwt;
  const query = qs.stringify({
    name: [firstName, lastName].filter(n => n).join(' '),
    email,
    mode: 'redirect',
  });

  res.redirect(`/sign-up?${query}`);
}

/**
 * Handles the sign-in request from Google Pay Enrollment and Sign up
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function signIn(req, res) {
  const { userProfile } = req.body;
  const jwt = JSON.parse(Buffer.from(userProfile, 'base64').toString('utf8'));
  const { email } = jwt;
  const query = qs.stringify({
    email,
    mode: 'redirect',
  });

  res.redirect(`/sign-in?${query}`);
}

/**
 * Create a loyalty account and a save to Google Pay JWT
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function createAccount(req, res) {
  // read credentials and website from configuration
  const { credentials, website } = getConfig(req);

  // read the name and email from the request body
  const { name, email } = req.body;

  // typical implementation would verify email
  // and save loyalty details to your back-end

  // Step 1: create a loyalty object
  const loyaltyObject = await createLoyaltyObject(name, email, 0);

  // Step 2: define jwt claims
  const claims = {
    aud: 'google',
    origins: [website],
    iss: credentials.client_email,
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [
        {
          id: loyaltyObject.id,
        },
      ],
    },
  };

  // Step 3: create and sign jwt
  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });

  // Step 4: return the token
  res.json({
    token,
    saveUrl: `https://pay.google.com/gp/v/save/${token}`,
  });
}

/**
 * Updates loyalty points
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function updatePoints(req, res) {
  const { memberId } = req.params;
  const { points } = req.body;
  await updateLoyaltyPoints(memberId, points);

  res.send({
    id: getLoyaltyId(memberId),
    memberId,
    points,
  });
}

/**
 * Reads configuration from the configuration object and incoming request
 *
 * @param {express.Request} req
 * @return {Object} configuration
 */
function getConfig(req) {
  return Object.assign({}, config, {
    website: config.website || req.headers.origin,
  });
}

exports.loyaltyRoutes = router;
