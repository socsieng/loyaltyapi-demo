FROM gcr.io/google.com/cloudsdktool/cloud-sdk:alpine as gloud-config
WORKDIR /usr/src/app
COPY scripts/gcp.sh ./scripts/gcp.sh

ENV GCP_PROJECT=""
ENV GCP_FOLDER_ID=""

CMD scripts/gcp.sh $GCP_PROJECT $GCP_FOLDER_ID
