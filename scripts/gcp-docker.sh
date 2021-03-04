#!/usr/bin/env bash

set -e

# colors
NONE='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[1;30m'

gcp_project=$1
gcp_folder=$2

if [ -f "./key.json" ]
then
  echo -e "Service account key already exists: ${GREEN}`realpath ./key.json`${NONE}"
  exit
fi

# build the container
docker build -t gcloud-service-account -f gcloud.Dockerfile .

# run the container
docker run -it --name gcp-service-account gcloud-service-account scripts/gcp.sh $gcp_project $gcp_folder

# copy the service account key from the container
docker cp gcp-service-account:/usr/src/app/key.json ./key.json
echo -e "Service account key copied to ${GREEN}`realpath ./key.json`${NONE}"

# remove the container
docker rm gcp-service-account > /dev/null
