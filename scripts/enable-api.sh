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


# This script downloads the service account key from GCP

set -e

script_folder=`cd $(dirname $0) && pwd`

gcp_project=$1

# colors
NONE='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[1;30m'

if [ -z "$gcp_project" ]
then
  >&2 echo -e "${RED}ERROR:${NONE} GCP project not specified"
  >&2 echo -e "  usage: service-account-key.sh <project-id> [folder-id]"
  exit 1
fi

# enable Passes API
gcloud services enable walletobjects.googleapis.com --project=$gcp_project
