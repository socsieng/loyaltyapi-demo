const express = require('express');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { buildLoyaltyObject, updateLoyaltyPoints, getLoyaltyId } = require('./services/loyalty-service');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/jwt', createJwt);
router.post('/:memberId/points', updatePoints);

function signUp(/** @type {express.Request} */ req, /** @type {express.Response} */ res) {
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

function signIn(/** @type {express.Request} */ req, /** @type {express.Response} */ res) {
  const { userProfile } = req.body;
  const jwt = JSON.parse(Buffer.from(userProfile, 'base64').toString('utf8'));
  const { email } = jwt;
  const query = qs.stringify({
    email,
    source: 'discoverable',
  });

  res.redirect(`/sign-in?${query}`);
}

function createJwt(/** @type {express.Request} */ req, /** @type {express.Response} */ res) {
  const { credentials, website } = config;
  const { name, email } = req.body;

  const claims = {
    aud: 'google',
    origins: [website],
    iss: credentials.client_email,
    iat: Math.floor(new Date().valueOf() / 1000),
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [buildLoyaltyObject(name, email, '0')],
    },
  };
  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });

  res.send({
    token,
  });
}

async function updatePoints(/** @type {express.Request} */ req, /** @type {express.Response} */ res) {
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
