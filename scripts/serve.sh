#!/usr/bin/env bash
# Copyright 2021 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


set -e

script_folder=`cd $(dirname $0) && pwd`

# colors
NONE='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[1;30m'

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

firebase emulators:start --project=fake-project
