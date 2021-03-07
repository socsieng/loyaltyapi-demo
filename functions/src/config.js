const functions = require('firebase-functions');

const firebaseConfig = Object.assign({ loyalty: {} }, functions.config());

function getCredentials() {
  let credentials = firebaseConfig.loyalty.credentials;

  if (!credentials) {
    const envCredentials = process.env.GCP_CREDENTIALS;
    if (!envCredentials) {
      throw new Error('GCP_CREDENTIALS environment variable is empty.');
    }
    if (envCredentials.startsWith('{')) {
      credentials = JSON.parse(envCredentials);
    }
    credentials = require(envCredentials);
  }

  if (!credentials) {
    throw new Error('Unable to load credentials.');
  }

  return credentials;
}

module.exports = {
  credentials: getCredentials(),
  issuerId: firebaseConfig.loyalty.issuer_id || process.env.GOOGLE_PAY_ISSUER_ID,
  website: firebaseConfig.loyalty.website || process.env.LOYALTY_WEBSITE,
  loyaltyProgram: firebaseConfig.loyalty.loyalty_program || process.env.LOYALTY_PROGRAM || 'codelab-demo',
};
