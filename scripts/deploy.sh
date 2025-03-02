#!/bin/bash

# Check if .env.local exists
if [ ! -f ../.env.local ]; then
  echo ".env.local not found."
  read -p "Enter PocketHost email address: " FTP_USERNAME
  read -p "Enter PocketHost password: " FTP_PASSWORD
  read -p "Enter PocketHost Instance Name: " FTP_SERVER_DIR

  cat <<EOF > ../.env.local
FTP_USERNAME=$FTP_USERNAME
FTP_PASSWORD=$FTP_PASSWORD
FTP_SERVER_DIR=$FTP_SERVER_DIR
EOF

else
  # Ensure FTP_USERNAME, FTP_PASSWORD are set in .env.local
  source ../.env.local
  if [ -z "$FTP_USERNAME" ] || [ -z "$FTP_PASSWORD" ]; then
    read -p "Enter FTP_USERNAME: " FTP_USERNAME
    read -p "Enter FTP_PASSWORD: " FTP_PASSWORD
    read -p "Enter FTP_SERVER_DIR: " FTP_SERVER_DIR
    echo "FTP_USERNAME=$FTP_USERNAME" >> ../.env.local
    echo "FTP_PASSWORD=$FTP_PASSWORD" >> ../.env.local
    echo "FTP_SERVER_DIR=$FTP_SERVER_DIR" >> ../.env.local
  fi
fi

cd ..

echo "Building the project..."
npm run build

echo "Project built."

# After FTP credentials are confirmed and set:
echo "Deploying to FTP..."
echo "FTP_USERNAME: $FTP_USERNAME"
echo "FTP_SERVER_DIR: $FTP_SERVER_DIR"

ftp-deploy \
  --server "ftp.pockethost.io" \
  --username "$FTP_USERNAME" \
  --password "$FTP_PASSWORD" \
  --local-dir "./dist/" \
  --server-dir "/$FTP_SERVER_DIR/"

echo "Deployment completed."
echo "You can view the deployed project at: https://$FTP_SERVER_DIR.pockethost.io"