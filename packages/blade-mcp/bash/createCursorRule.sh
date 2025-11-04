#!/bin/bash
# Download frontend-blade-rules.mdc from GitHub and save to .cursor/rules
TARGET_DIR=".cursor/rules"
URL="https://raw.githubusercontent.com/razorpay/blade/master/packages/blade-mcp/cursorRules/frontend-blade-rules.mdc"
FILE_PATH="$TARGET_DIR/frontend-blade-rules.mdc"
# Create directory if it doesn't exist (works even if it already exists)
mkdir -p "$TARGET_DIR"
curl -sSL "$URL" -o "$FILE_PATH"

