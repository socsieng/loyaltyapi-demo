const { GoogleAuth } = require('google-auth-library');

async function getPassesClient() {
  /** @type {import('google-auth-library').GoogleAuthOptions} */
  const authOptions = {
    scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
  };

  const envCredentials = process.env.GCP_CREDENTIALS;
  if (envCredentials) {
    authOptions.keyFile = envCredentials;
  }
  if (envCredentials.startsWith('{')) {
    authOptions.credentials = JSON.parse(envCredentials);
  }

  const auth = new GoogleAuth(authOptions);
  return await auth.getClient();
}

async function main() {
  if (!process.env.GCP_CREDENTIALS) {
    console.error('GCP_CREDENTIALS must be set.');
    return;
  }
  if (!process.env.GOOGLE_PAY_ISSUER_ID) {
    console.error('GOOGLE_PAY_ISSUER_ID must be set.');
    return;
  }
  if (!process.env.LOYALTY_WEBSITE) {
    console.error('LOYALTY_WEBSITE must be set.');
    return;
  }

  const client = await getPassesClient();
  const loyaltyProgram = {
    id: `${process.env.GOOGLE_PAY_ISSUER_ID}.gpay-rewards`,
    issuerName: 'GPay Demo',
    programName: 'GPay Demo Rewards',
    programLogo: { sourceUri: { uri: `${process.env.LOYALTY_WEBSITE}/images/logo.png` } },
    reviewStatus: 'UNDER_REVIEW',
    discoverableProgram: {
      merchantSignupInfo: {
        signupWebsite: { uri: `${process.env.LOYALTY_WEBSITE}/api/loyalty/sign-up` },
        signupSharedDatas: ['FIRST_NAME', 'LAST_NAME', 'EMAIL'],
      },
      merchantSigninInfo: {
        signinWebsite: { uri: `${process.env.LOYALTY_WEBSITE}/api/loyalty/sign-in` },
      },
    },
    countryCode: 'US',
  };

  let exists = false;

  try {
    const existingProgramRequest = await client.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${loyaltyProgram.id}?strict=true'`,
    });
    console.log(existingProgramRequest.data);
    exists = true;
  } catch {
    exists = false;
  }

  if (exists) {
    await client.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${loyaltyProgram.id}?strict=true'`,
      method: 'PATCH',
      body: JSON.stringify(loyaltyProgram),
    });
  } else {
    await client.request({
      url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass?strict=true',
      method: 'POST',
      body: JSON.stringify(loyaltyProgram),
    });
  }
}

main().catch(console.error);
