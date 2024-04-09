#!/bin/bash

# 1. Modify package.json to add type:module
# 2. Trigger wdio tests
# 3. Revert package.json

wait-on http://bs-local.com:9009 --timeout 50000

# if there is timeout exit
if [ $? -ne 0 ]; then
  echo "Timeout waiting for http://localhost:9009"
  exit 1
fi

# Add `"type": "module"` to package.json and write it back to the file with jq
jq '. + { "type": "module" }' package.json > tmp.$$.json && mv tmp.$$.json package.json

# Trigger wdio tests
E2E_BASE_URL=http://bs-local.com:9009/iframe.html wdio wdio.bstack.conf.ts $@

# Revert package.json
jq 'del(.type)' package.json > tmp.$$.json && mv tmp.$$.json package.json
