#!/bin/bash

echo "Installing dependencies..."

# Run npm install

cd .. && npm install

echo "Dependencies installed."

cd scripts

# Function to detect the platform
detect_platform() {
    unameOut="$(uname -s)"
    case "${unameOut}" in
        Linux*)     machine=linux;;
        Darwin*)    machine=darwin;;
        CYGWIN*)    machine=cygwin;;
        MINGW*)     machine=mingw;;
        *)          machine="UNKNOWN:${unameOut}"
    esac
    echo ${machine}
}

# Function to detect the architecture
detect_architecture() {
    archOut="$(uname -m)"
    case "${archOut}" in
        x86_64)     arch=amd64;;
        arm64)      arch=arm64;;
        *)          arch="UNKNOWN:${archOut}"
    esac
    echo ${arch}
}

# Detect platform and architecture
platform=$(detect_platform)
architecture=$(detect_architecture)

# Check if platform and architecture are supported
if [[ "$platform" == "UNKNOWN"* ]] || [[ "$architecture" == "UNKNOWN"* ]]; then
    echo "Unsupported platform or architecture: ${platform} ${architecture}"
    exit 1
fi

# Define the PocketBase version
version="0.25.8"

echo "Downloading PocketBase version ${version} for ${platform} ${architecture}..."

# Construct the download URL
url="https://github.com/pocketbase/pocketbase/releases/download/v${version}/pocketbase_${version}_${platform}_${architecture}.zip"

# Download the PocketBase release
echo "Downloading PocketBase from ${url}..."
curl -L -o pocketbase.zip ${url}

# Unzip the downloaded file to a folder called pb_temp
echo "Unzipping pocketbase.zip..."
unzip pocketbase.zip -d pb_temp

# Clean up the zip file
rm pocketbase.zip

# Copy the PocketBase binary to the pb directory
cp pb_temp/pocketbase ../server

# Clean up the extracted directory
rm -rf pb_temp

# Create an app name variable, based on the directory above the current directory
app_name=$(basename $(dirname $(pwd)))

# Prompt the user for the app name
read -p "Enter the app name (default: $app_name): " input_app_name

# Use the input app name if provided
if [ ! -z "$input_app_name" ]; then
    app_name=$input_app_name
fi

../server/pocketbase meta appName="$app_name"

# Create an smtp host (default to smtp.mailgun.org)
read -p "Enter SMTP host (default: smtp.mailgun.org): " smtp_host

# Set the default smtp host if not provided
if [ -z "$smtp_host" ]; then
    smtp_host="smtp.mailgun.org"
fi

# Create an smtp username
read -p "Enter SMTP username: " smtp_username

# Create an smtp password 
read -p "Enter SMTP password: " smtp_password

# Use the input smtp host, username, and password if provided
if [ ! -z "$smtp_host" ]; then
    ../server/pocketbase smtp host="$smtp_host" port=587 username="$smtp_username" password="$smtp_password"
fi

# Create a sending domain (default to ivy242.net)
read -p "Enter sending domain (default: ivy242.net): " sending_domain

# Set the default sending domain if not provided
if [ -z "$sending_domain" ]; then
    sending_domain="ivy242.net"
fi

../server/pocketbase meta senderAddress="support@$sending_domain"

echo "Creating initial superuser..."

../server/pocketbase superuser email=admin@ivy242.net password=admin@ivy242.net

echo "PocketBase setup completed."

echo "Running initial build..."

cd ..

# Run the build script
npm run build -w scripts

echo "Initial build completed."

echo "All set! You can get started by running 'npm run preview -w scripts'."