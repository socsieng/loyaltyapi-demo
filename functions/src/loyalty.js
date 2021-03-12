const express = require('express');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const config = require('./config');
const { createLoyaltyObject, updateLoyaltyPoints, getLoyaltyId } = require('./services/loyalty-service');

// eslint-disable-next-line new-cap
const router = express.Router();

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
    source: 'discoverable',
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
    source: 'discoverable',
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
  const { credentials, website } = config;

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
  // throw new Error('Not implemented');
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

exports.loyaltyRoutes = router;
