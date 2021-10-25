// const crypto = require('crypto');

// const pathFiles = ['icon.png', 'logo.png', 'pass.json'];

// function getFileHash(basePath, filename) {
//   const file = fs.readFileSync(path.resolve(basePath, filename));
//   const hash = crypto.createHash('sha1');
//   hash.update(file);

//   return hash.digest('hex');
// }

// function createManifest() {
//   const manifestContents = {};
//   for (const file of pathFiles) {
//     manifestContents[file] = getFileHash(path.resolve(__dirname, '../pass_template'), file);
//   }

//   return JSON.stringify(manifestContents, null, '  ');
// }

// console.log(createManifest());

const fs = require('fs');
const path = require('path');
const { PKPass } = require('passkit-generator');

(async () => {
  const pass = await PKPass.from(
    {
      model: path.resolve(__dirname, '../pass_template'),
      certificates: {
        wwdr: fs.readFileSync(path.resolve(__dirname, '../certs/wwdr.pem')),
        signerCert: fs.readFileSync(path.resolve(__dirname, '../certs/pass-2.pem')),
        signerKey: fs.readFileSync(path.resolve(__dirname, '../certs/passes_private.pem')),
        signerKeyPassphrase: process.env.PRIVATE_KEY_PASSPHRASE,
      },
    },
    {},
  );

  const buffer = pass.getAsBuffer();

  fs.writeFileSync('pass-2.pkpass', buffer);
})();
