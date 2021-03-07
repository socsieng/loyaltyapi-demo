const { GoogleAuth } = require('google-auth-library');
const config = require('../config');

async function getPassesClient() {
  const authOptions = {
    scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
  };

  authOptions.credentials = config.credentials;

  const auth = new GoogleAuth(authOptions);
  return await auth.getClient();
}

function getLoyaltyId(memberId) {
  const { issuerId, loyaltyProgram } = config;

  return `${issuerId}.${memberId.replace(/@/g, '_at_').replace(/[^\w.-]/g, '_')}-${loyaltyProgram}`;
}

function buildLoyaltyObject(name, email, points) {
  const { issuerId, loyaltyProgram } = config;
  const memberId = email;

  return {
    id: getLoyaltyId(memberId),
    classId: `${issuerId}.${loyaltyProgram}`,
    accountId: memberId,
    accountName: name,
    state: 'active',
    barcode: {
      alternateText: email,
      type: 'qrCode',
      value: email,
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
    loyaltyPoints: {
      balance: {
        string: points,
      },
      label: 'Points',
    },
    textModulesData: [
      {
        body: 'New member',
        header: 'Reward status',
      },
    ],
  };
}

async function updateLoyaltyPoints(memberId, points) {
  const client = await getPassesClient();
  const loyaltyId = getLoyaltyId(memberId);

  await client.request({
    url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${loyaltyId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: loyaltyId,
      loyaltyPoints: {
        balance: {
          string: points,
        },
        label: 'Points',
      },
    }),
  });
}

module.exports = {
  buildLoyaltyObject,
  getLoyaltyId,
  updateLoyaltyPoints,
};
