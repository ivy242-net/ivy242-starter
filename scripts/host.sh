#!/bin/bash

# Source the .env.local file from the parent directory
if [ -f ../.env.local ]; then
    export $(xargs < ../.env.local)
fi

# Function to identify the local IP address
get_local_ip() {
    if command -v ip > /dev/null; then
        # For Linux
        ip route get 1 | awk '{print $NF;exit}'
    elif command -v ifconfig > /dev/null; then
        # For macOS
        ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -n 1
    else
        echo "Neither 'ip' nor 'ifconfig' command found."
        exit 1
    fi
}

# Get the local IP address
local_ip=$(get_local_ip)

# Check if the local IP address was identified
if [ -z "$local_ip" ]; then
    echo "Failed to identify the local IP address."
    exit 1
fi

# Programatically set the App url to the local IP address
echo "Setting the App URL to http://$local_ip:8090"
../pocketbase meta appURL="http://$local_ip:8090"


# Start PocketBase with the identified local IP address
echo "Starting PocketBase on IP: $local_ip"
../pocketbase serve --hooksWatch=true --http="$local_ip:8090"
