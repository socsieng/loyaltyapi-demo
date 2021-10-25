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

openssl genrsa -out passes_private.key 2048

openssl req -new -key passes_private.key -out passes.csr

openssl rsa -in passes_private.key -outform PEM -out passes_private.pem

# convert the downloaded pass.cer file to pass.pem
# openssl x509 -inform DER -outform PEM -in pass.cer -out pass.pem
