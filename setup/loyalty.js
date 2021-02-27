const { GoogleAuth } = require('google-auth-library');

async function getPassesClient() {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
  });
  return await auth.getClient();
}

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS must be set.');
    return;
  }
  if (!process.env.GOOGLE_PAY_ISSUER_ID) {
    console.error('GOOGLE_PAY_ISSUER_ID must be set.');
    return;
  }

  const client = await getPassesClient();
  const loyaltyProgram = {
    id: `${process.env.GOOGLE_PAY_ISSUER_ID}.first-rewards`,
    issuerName: "Soc's Demo",
    programName: 'First Rewards',
    programLogo: { sourceUri: { uri: 'https://soc-loyaltyapi-demo.web.app/images/logo.png' } },
    reviewStatus: 'UNDER_REVIEW',
    discoverableProgram: {
      merchantSignupInfo: {
        signupWebsite: { uri: 'https://soc-loyaltyapi-demo.web.app/api/loyalty/sign-up' },
        signupSharedDatas: ['FIRST_NAME', 'LAST_NAME', 'EMAIL'],
      },
      merchantSigninInfo: {
        signinWebsite: { uri: 'https://soc-loyaltyapi-demo.web.app/api/loyalty/sign-in' },
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
