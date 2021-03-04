# Google Pay Loyalty API Demo

This repository contains a [Google Loyalty API][passes] demo application with the front-end built using
`create-react-app` and the back-end implemented with [Node.js][nodejs] and hosted with Firebase Functions; both written
with TypeScript.

## Before you start

In order to run this application, ensure that you have the following prerequisites are met:

1. [Node.js][nodejs] 10 or later installed.
2. Google Cloud Platform (GCP) service account and download the service account key.
   - _Optional_ (if [`gcloud`][install_gcloud] is installed): run `scripts/gcp.sh <project-name> [folder-id]`
3. Have a [Google Pay `issuer_id`](issuers) ([sign up for access][passes_signup]).
4. Grant `edit` access to the shared account.
5. Copy `.env_sample` to `.env`.
   1. Uncomment environment variables.
   2. Update environment variable values with downloaded service account key from step 1 and `issuer_id` from step 2.

## Getting started

```sh
# one off setup step
scripts/setup.sh

# serve firebase application
scripts/serve.sh

# application will run on http://localhost:5000 by default
# open http://localhost:5000/sign-up in the browser to start testing.
```

[passes]: https://developers.google.com/pay/passes/guides/introduction/about-google-pay-api-for-passes
[nodejs]: https://nodejs.org/
[issuers]: https://pay.google.com/gp/m/issuer/list
[passes_signup]: https://support.google.com/pay/merchants/contact/instore_merchant
[install_gcloud]: https://cloud.google.com/sdk/docs/install
