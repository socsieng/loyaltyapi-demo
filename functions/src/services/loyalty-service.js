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

const config = require('../config');
const PassesClient = require('../passes-client');

function getLoyaltyId(memberId) {
  const { issuerId, loyaltyProgram } = config;

  return `${issuerId}.${memberId.replace(/@/g, '_at_').replace(/[^\w.-]/g, '_')}-${loyaltyProgram}`;
}

/**
 * Creates and posts a loyaltyObject
 *
 * @param {string} name
 * @param {string} email
 * @param {number} points
 * @return {Promise<object>} loyaltyObject
 */
async function createLoyaltyObject(name, email, points) {
  const client = new PassesClient();

  // read issuerId and loyalty program from config
  const { issuerId, loyaltyProgram } = config;

  // Step 1: construct loyaltyObject
  const loyaltyObject = {
    id: getLoyaltyId(email),
    classId: `${issuerId}.${loyaltyProgram}`,
    accountId: email,
    accountName: name,
    state: 'active',
    loyaltyPoints: {
      balance: {
        int: points,
      },
      label: 'Points',
    },
    barcode: {
      type: 'qrCode',
      value: email,
    },
  };

  // Step 2: insert the loyaltyObject
  await client.postIfNotFound(
    'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject',
    loyaltyObject,
    loyaltyObject.id,
  );

  return loyaltyObject;
}

/**
 * Updates the points for a loyaltyObject identified by an email address
 *
 * @param {string} email
 * @param {number} points
 */
async function updateLoyaltyPoints(email, points) {
  const client = new PassesClient();
  const loyaltyId = getLoyaltyId(email);

  // Step 1: define fields that require updating
  const loyaltyObject = {
    id: loyaltyId,
    loyaltyPoints: {
      balance: {
        int: points,
      },
    },
  };

  // Step 2: call REST API to update points
  await client.patch(`https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${loyaltyId}`, loyaltyObject);
}

module.exports = {
  createLoyaltyObject,
  getLoyaltyId,
  updateLoyaltyPoints,
};
