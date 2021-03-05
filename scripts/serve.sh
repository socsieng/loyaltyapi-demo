#!/usr/bin/env bash

set -e

script_folder=`cd $(dirname $0) && pwd`

# colors
NONE='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[1;30m'

port=${PORT:-"8080"}

# load .env variables if they exist
if [ -f .env ]
then
  set -o allexport
  source .env
  set +o allexport
fi

# build react app
cd $script_folder/../www \
  && npm run build

# build firebase functions
cd $script_folder/../functions \
  && npm run build

# check environment variables are defined
if [ -z "$GCP_CREDENTIALS" ]
then
  echo -e "${YELLOW}WARNING:${NONE} GCP_CREDENTIALS environment variable is empty"
else
  if [ ! -f "$GCP_CREDENTIALS" ]
  then
    echo -e "${YELLOW}WARNING:${NONE} $GCP_CREDENTIALS does not exist"
  fi
fi

if [ -z "$GOOGLE_PAY_ISSUER_ID" ]
then
  echo -e "${YELLOW}WARNING:${NONE} GOOGLE_PAY_ISSUER_ID environment variable is empty"
fi

if [ -z "$LOYALTY_WEBSITE" ]
then
  echo -e "${YELLOW}WARNING:${NONE} LOYALTY_WEBSITE environment variable is empty"
fi

firebase serve --port $port
