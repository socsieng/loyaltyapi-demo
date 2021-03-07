#!/usr/bin/env bash

# This script downloads the service account key from GCP

set -e

script_folder=`cd $(dirname $0) && pwd`

gcp_project=$1
gcp_folder=$2

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

if [ -f "./key.json" ]
then
  echo -e "Service account key already exists: ${GREEN}`realpath ./key.json`${NONE}"
else
  # confirm that the user is logged in
  gcp_account=`gcloud auth list --format="value(account)" --filter="status:ACTIVE" 2>/dev/null`

  if [ -z "$gcp_account" ]
  then
    gcloud auth login
  fi

  gcp_project_number=`gcloud projects list --format="value(projectNumber)" --filter="projectId:$gcp_project" 2>/dev/null`

  # check if project exists, optionally create project
  if [ -z "$gcp_project_number" ]
  then
    if [[ ! $gcp_project =~ ^[a-z][-a-z0-9]{4,28}[a-z0-9]$ ]]
    then
      >&2 echo -e "${RED}ERROR:${NONE} GCP project id must be between 6 and 30 characters."
      >&2 echo -e "  project id can have lowercase letters, digits, or hyphens. It must start with a lowercase letter and end with a letter or number."
      exit 1
    fi

    prompt=`echo -e "Project $gcp_project does not exist. Create ${GRAY}(y/N)${NONE}? "`
    read -p "$prompt" response

    if [[ $response =~ ^[Yy] ]]
    then
      if [ -z "$gcp_folder" ]
      then
        echo -e "Creating project $gcp_project"
      else
        echo -e "Creating project $gcp_project (in folder $gcp_folder)"
      fi

      gcloud projects create $gcp_project --folder=$gcp_folder
    else
      exit
    fi
  fi

  # get service account
  gcp_service_account_name="loyalty-web-app"
  gcp_service_account_email="$gcp_service_account_name@$gcp_project.iam.gserviceaccount.com"
  gcp_service_account=`gcloud iam service-accounts list --project=$gcp_project --format="value(email)" --filter="email:$gcp_service_account_email" 2>/dev/null`

  if [ -z "$gcp_service_account" ]
  then
    echo -e "Creating service account ${GREEN}$gcp_service_account_email${NONE}"
    gcloud iam service-accounts create $gcp_service_account_name --project=$gcp_project
  fi

  # create/save service account key
  gcloud iam service-accounts keys create ./key.json --iam-account=$gcp_service_account_email --project=$gcp_project
  echo -e "Service account key saved to ${GREEN}`realpath ./key.json`${NONE}"
fi

# enable Passes API
gcloud services enable walletobjects.googleapis.com --project=$gcp_project
