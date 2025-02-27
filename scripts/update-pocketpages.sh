# Ask user for the desired pocketpages version number
echo "Enter the desired PocketPages version number:"
read -p "Version number (e.g., 0.15.5): " version

# Run npm install at the version number

cd ../

npm install pocketpages@$version

# Copy the dist/index.js file from the pocketpages node_modules folder to the pb_hooks folder as pocketpages.pb.js (replace if it already exists)

cp node_modules/pocketpages/dist/index.js pb_hooks/pocketpages.pb.js

echo "PocketPages updated to version $version."