# Ask the user for the desired PocketBase version number
echo "Enter the desired PocketBase version number:"
read -p "Version number (e.g., 0.25.8): " version

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

echo "PocketBase updated to version $version."