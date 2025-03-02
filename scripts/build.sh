#!/bin/bash

# Create a dist folder, and copy pb_public, pb_hooks, and pb_migrations to it

# Create the dist directory if it doesn't exist
mkdir -p ../dist

# Check if pb_public exists and copy it
if [ -d "../pb_public" ]; then
    cp -r ../pb_public ../dist/
else
    echo "Warning: ./pb_public directory does not exist."
fi

# Check if pb_hooks exists and copy it
if [ -d "../pb_hooks" ]; then
    cp -r ../pb_hooks ../dist/
else
    echo "Warning: ./pb_hooks directory does not exist."
fi

# Check if pb_migrations exists and copy it
if [ -d "../pb_migrations" ]; then
    cp -r ../pb_migrations ../dist/
else
    echo "Warning: ./pb_migrations directory does not exist."
fi

# Check if package.json exists and copy it
if [ -f "../package.json" ]; then
    cp ../package.json ../dist/
else
    echo "Warning: ./package.json file does not exist."
fi

echo "Build dist folder completed."