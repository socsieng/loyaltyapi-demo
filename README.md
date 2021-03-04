# Google Pay Loyalty API Demo

This repository contains a [Google Loyalty API][passes] demo application with the front-end built using
`create-react-app` and the back-end implemented with [Node.js][nodejs] and hosted with Firebase Functions; both written
with TypeScript.

## Before you start

In order to run this application, ensure that you have the following prerequisites are met:

1. [Node.js][nodejs] 10 or later installed.
2. [Google Cloud Platform (GCP) configuration](#Google-Cloud-Platform-configuration).
3. Have a [Google Pay `issuer_id`](issuers) ([sign up for access][passes_signup]).
4. Grant `edit` access to the shared account.
5. Copy `.env_sample` to `.env` (if `.env` doesn't already exist).
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

## Google Cloud Platform configuration

Configuration involves the following steps:

1. Create a service account
2. Create and download the service account key
3. Enable the Google Pay Passes API

A couple of scripts are made available to help streamline the configuration process depending on the tools that you have
installed or are able to install.

Tools:

- [Google Cloud SDK](#Google-Cloud-SDK), or
- [Docker](#Docker)

### [Google Cloud SDK][install_gcloud]

This is the recommended configuration script which uses `gcloud` ([Google Cloud SDK][install_gcloud]):

```sh
# usage: scripts/gcp.sh <project-name> [folder-id]

# example
scripts/gcp.sh my-google-cloud-project-name
```

### [Docker][docker]

As an alternative to installing `gcloud`, the following script run `gcloud` using a Docker container:

```sh
# usage: scripts/gcp-docker.sh <project-name> [folder-id]

# example
scripts/gcp-docker.sh my-google-cloud-project-name

# note that you will be prompted to open a link in the browser
# follow the link, login, and authorize the application
# and finally copy/paste the verification code into your terminal window
```

### [Google Cloud Console][gcp_console]

If none of the configuration scripts above are available to, use the following instructions to manually configure GCP
using the Google Cloud Console:

1. [Create a service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating)
2. [Create a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys)
3. [Enable the Google Pay Passes API](https://developers.google.com/pay/passes/guides/basic-setup/get-access-to-rest-api#register)

   > 6. Click Go to [APIs overview](https://console.cloud.google.com/apis/dashboard). Then, click **ENABLE APIS AND
   >    SERVICES**.
   > 7. Search for **Google Pay Passes API**, and click **Enable**.

[passes]: https://developers.google.com/pay/passes/guides/introduction/about-google-pay-api-for-passes
[nodejs]: https://nodejs.org/
[issuers]: https://pay.google.com/gp/m/issuer/list
[passes_signup]: https://support.google.com/pay/merchants/contact/instore_merchant
[install_gcloud]: https://cloud.google.com/sdk/docs/install
[docker]: https://www.docker.com/products/docker-desktop
[gcp_console]: https://console.cloud.google.com
