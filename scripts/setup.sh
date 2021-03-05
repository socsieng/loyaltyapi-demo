#!/usr/bin/env bash

set -e

script_folder=`cd $(dirname $0) && pwd`

# create .env file
if [ ! -f .env ]
then
  sed $'s/# copy this file and rename it as .env//g' .env_sample > .env
fi

# install firebase-tools
npm install --global firebase-tools

# install root dependencies
npm install

# install react app dependencies
cd $script_folder/../www \
  && npm install

# install firebase functions dependencies
cd $script_folder/../functions \
  && npm install

firebase login --no-localhost
