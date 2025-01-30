#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Load environment variables from .env
source .env

# Check required environment variables
if [ -z "$ALEXA_DEBUG_TOKEN" ] || [ -z "$SKILL_ID" ]; then
    echo "Error: ALEXA_DEBUG_TOKEN and SKILL_ID must be set in .env file"
    exit 1
fi

# Compile TypeScript first
echo "Compiling TypeScript..."
pnpm build

# Start local debug session
node ./node_modules/ask-sdk-local-debug/dist/LocalDebuggerInvoker.js \
    --accessToken $ALEXA_DEBUG_TOKEN \
    --skillId $SKILL_ID \
    --handlerName handler \
    --skillEntryFile $(pwd)/dist/index.js
