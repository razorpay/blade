#!/bin/bash

# 1. Run Storybook
# 2. Modify package.json to add type:module
# 3. Trigger wdio tests
# 4. Revert package.json

# Run Storybook
yarn react:storybook &
sleep 10

# Add `"type": "module"` to package.json and write it back to the file with jq
jq '. + { "type": "module" }' package.json > tmp.$$.json && mv tmp.$$.json package.json

# Trigger wdio tests
E2E_BASE_URL=http://bs-local.com:9009/iframe.html wdio wdio.bstack.conf.ts

# Revert package.json
jq 'del(.type)' package.json > tmp.$$.json && mv tmp.$$.json package.json

# Kill Storybook
kill $(lsof -t -i:9009)

# Exit
exit 0
