import express from 'express';
import qs from 'querystring';
import jwt from 'jsonwebtoken';
import * as functions from 'firebase-functions';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/jwt', createJwt);

function signUp(req: express.Request, res: express.Response) {
  const { userProfile } = req.body;
  const jwt = JSON.parse(Buffer.from(userProfile, 'base64').toString('utf8'));
  const { firstName, lastName, email } = jwt;
  const query = qs.stringify({
    name: [firstName, lastName].filter(n => n).join(' '),
    email,
  });

  res.redirect(`/sign-up?${query}`);
}

function signIn(req: express.Request, res: express.Response) {
  const { userProfile } = req.body;
  const jwt = JSON.parse(Buffer.from(userProfile, 'base64').toString('utf8'));
  const { email } = jwt;
  const query = qs.stringify({
    email,
  });

  res.redirect(`/sign-in?${query}`);
}

function createJwt(req: express.Request, res: express.Response) {
  const firebaseConfig = functions.config();

  const credentials = firebaseConfig.loyalty?.credentials
    ? firebaseConfig.loyalty.credentials
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      require(process.env.GOOGLE_APPLICATION_CREDENTIALS!);

  // eslint-disable-next-line camelcase
  const issuerId = firebaseConfig.loyalty?.issuer_id ?? process.env.GOOGLE_PAY_ISSUER_ID;
  const website = firebaseConfig.loyalty?.website ?? process.env.LOYALT_WEBSITE;
  const { name, email } = req.body;
  const memberId = email;
  const loyaltyProgram = 'first-rewards';

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
                description: 'First Rewards Account',
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

export const loyaltyRoutes = router;
