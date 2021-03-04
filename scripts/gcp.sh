#!/usr/bin/env bash

# This script initializes 

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
  >&2 echo -e "${RED}ERROR:${NONE} GCP project not specified."
  >&2 echo -e "  usage: gcp.sh <project-name> [folder-id]"
  exit 1
fi

# confirm that the user is logged in
gcp_account=`gcloud auth list --format="value(account)" --filter="status:ACTIVE" 2>/dev/null`

if [ -z "$gcp_account" ]
then
  >&2 echo -e "${RED}ERROR:${NONE} not currently logged into gcloud."
  >&2 echo -e "  log in with the following command: gcloud auth login"
  exit 1
fi

gcp_project_number=`gcloud projects list --format="value(projectNumber)" --filter="projectId:$gcp_project" 2>/dev/null`

# check if project exists, optionally create project
if [ -z "$gcp_project_number" ]
then
  prompt=`echo -e "Project $gcp_project does not exist. Create ${GRAY}(y/N)${NONE}? "`
  read -p "$prompt" response

  if [[ $response =~ ^[Yy] ]]
  then
    if [ -z "$gcp_folder" ]
    then
      echo -e "Creating project $gcp_project."
    else
      echo -e "Creating project $gcp_project (in folder $gcp_folder)."
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
  echo -e "Creating service account $gcp_service_account_email."
  gcloud iam service-accounts create $gcp_service_account_name --project=$gcp_project
  gcloud iam service-accounts keys create ./key.json --iam-account=$gcp_service_account_email --project=$gcp_project
fi
