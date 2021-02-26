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

  await client.request({
    url: 'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass?strict=true',
    method: 'POST',
    body: JSON.stringify({
      id: `${process.env.GOOGLE_PAY_ISSUER_ID}.number-one-rewards`,
      issuerName: "Soc's Demo",
      programName: 'Number One Rewards',
      programLogo: { sourceUri: { uri: 'https://soc-loyaltyapi-demo.web.app/images/loyalty-icon.png' } },
      reviewStatus: 'draft',
      discoverableProgram: {
        merchantSignupInfo: {
          signupWebsite: { uri: 'https://soc-loyaltyapi-demo.web.app/sign-up' },
          signupSharedDatas: ['FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE'],
        },
        merchantSigninInfo: {
          signinWebsite: { uri: 'https://soc-loyaltyapi-demo.web.app/sign-in' },
        },
      },
      countryCode: 'US',
    }),
  });
}

main().catch(console.error);
