#!/usr/bin/env bash

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
