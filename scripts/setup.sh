#!/bin/bash

echo "Installing dependencies..."

# Run npm install

cd ../ && npm install

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

# List the contents of the unzipped directory for debugging
echo "Contents of the unzipped directory:"
ls -l pb_temp

# Clean up the zip file
rm pocketbase.zip

# Copy the PocketBase binary to the project root
echo "Copying PocketBase binary to the current directory..."
cp pb_temp/pocketbase ../pocketbase

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

../pocketbase meta appName="$app_name"

# Create an smtp password 
read -p "Enter the smtp password (found in Ivy242 proton pass): " smtp_password

# Use the input smtp password if provided
if [ ! -z "$smtp_password" ]; then
    ../pocketbase smtp host="smtp.mailgun.org" port=587 username="postmaster@mg.ivy242.net" password="$smtp_password"
fi

echo "Creating initial superuser..."

../pocketbase superuser email=admin@ivy242.net password=admin@ivy242.net

echo "PocketBase setup completed."

echo "Running initial build..."

cd ..

# Run the build script
npm run build

echo "Initial build completed."

echo "All set! You can get started by running 'npm run host'."