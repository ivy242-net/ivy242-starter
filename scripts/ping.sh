#!/bin/bash

# Send a POST request mimicking a Gumroad ping to the local host at xpi/ping

# Source the .env.local file from the parent directory
if [ -f ../.env.local ]; then
    export $(xargs < ../.env.local)
else
    echo "The .env.local file was not found."
    exit 1
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

# Log the local IP address
echo "Local IP address: $local_ip"

# Get product id from the LEMON_SQUEEZY_PRODUCT_ID env variable
product_id=$LEMON_SQUEEZY_PRODUCT_ID

# Get variant id from the LEMON_SQUEEZY_VARIANT_ID_SINGLE env variable
variant_id=$LEMON_SQUEEZY_VARIANT_ID_SINGLE

# Get X signature from the LEMON_SQUEEZY_SIGNING_SECRET env variable
x_signature=$LEMON_SQUEEZY_SIGNING_SECRET

echo "X signature: $x_signature"

echo "Sending a POST request mimicking a Lemon Squeezy webhook to the local host at xpi/ping"

# Create the JSON payload
json_payload=$(cat <<EOF
{
  "data": {
    "attributes": {
      "identifier": "c9ff530f-8668-414d-ade1-2651376cf391",
      "user_email": "lindseymacmillan@proton.me",
      "first_order_item": {
        "id": 4668968,
        "test_mode": true,
        "product_id": $product_id,
        "variant_id": $variant_id,
        "product_name": "Stickr.Chat Chatrooms!",
        "variant_name": "Single stickr"
      }
    }
  },
  "meta": {
    "test_mode": true,
    "event_name": "order_created"
  }
}
EOF
)

# Send a POST request mimicking a LemonSqueezy ping to the local host at xpi/ping
curl -X POST -H "Content-Type: application/json" -H "X-Signature: $x_signature" -d "$json_payload" http://$local_ip:8090/xpi/ping