#!/bin/bash

# 1. Modify package.json to add type:module
# 2. Trigger wdio tests
# 3. Revert package.json

# Add `"type": "module"` to package.json and write it back to the file with jq
jq '. + { "type": "module" }' package.json > tmp.$$.json && mv tmp.$$.json package.json

# Trigger wdio tests also pass any extra shell arguments to wdio
E2E_BASE_URL=http://bs-local.com:9009/iframe.html wdio wdio.local.conf.ts $@

# Revert package.json
jq 'del(.type)' package.json > tmp.$$.json && mv tmp.$$.json package.json
