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
