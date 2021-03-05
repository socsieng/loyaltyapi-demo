const express = require('express');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
const functions = require('firebase-functions');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/jwt', createJwt);

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
  const firebaseConfig = Object.assign({ loyalty: {} }, functions.config());

  const credentials = firebaseConfig.loyalty.credentials
    ? firebaseConfig.loyalty.credentials
    : getCredentialsFromEnvironmentVariable();

  // eslint-disable-next-line camelcase
  const issuerId = firebaseConfig.loyalty.issuer_id || process.env.GOOGLE_PAY_ISSUER_ID;
  const website = firebaseConfig.loyalty.website || process.env.LOYALTY_WEBSITE;
  const { name, email } = req.body;
  const memberId = email;
  const loyaltyProgram = 'gpay-rewards';

  const claims = {
    aud: 'google',
    origins: [website],
    iss: credentials.client_email,
    iat: Math.floor(new Date().valueOf() / 1000),
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [
        {
          barcode: {
            alternateText: email,
            type: 'qrCode',
            value: email,
          },
          linksModuleData: {
            uris: [
              {
                kind: 'walletobjects#uri',
                uri: `${website}/members/${encodeURIComponent(memberId)}`,
                description: 'GPay Rewards Account',
              },
            ],
          },
          infoModuleData: {
            labelValueRows: [
              {
                columns: [
                  {
                    value: name,
                    label: 'Name',
                  },
                  {
                    value: memberId,
                    label: 'Email',
                  },
                ],
              },
            ],
            showLastUpdateTime: 'false',
          },
          id: `${issuerId}.${memberId.replace(/@/g, '_at_').replace(/\+/g, '_plus_')}-${loyaltyProgram}`,
          loyaltyPoints: {
            balance: {
              string: '0',
            },
            label: 'Points',
          },
          accountId: memberId,
          classId: `${issuerId}.${loyaltyProgram}`,
          accountName: name,
          state: 'active',
          version: 1,
          textModulesData: [
            {
              body: 'New member',
              header: 'Reward status',
            },
          ],
        },
      ],
    },
  };
  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });

  res.send({
    token,
  });
}

function getCredentialsFromEnvironmentVariable() {
  const envCredentials = process.env.GCP_CREDENTIALS;
  if (!envCredentials) {
    throw new Error('GCP_CREDENTIALS environment variable is empty.');
  }
  if (envCredentials.startsWith('{')) {
    return JSON.parse(envCredentials);
  }
  return require(envCredentials);
}

exports.loyaltyRoutes = router;
