#!/bin/bash
# Design Sync Cleanup Script
# Removes temporary build artifacts while keeping source files

set -e

echo "🧹 Cleaning design-sync artifacts..."

# Remove temporary directories
if [ -d ".ds-sync" ]; then
  echo "  Removing .ds-sync/ (converter scripts)"
  rm -rf .ds-sync/
fi

if [ -d "ds-bundle" ]; then
  echo "  Removing ds-bundle/ (build output)"
  rm -rf ds-bundle/
fi

# Check for uncommitted changes
if [[ $(git status --porcelain) ]]; then
  echo ""
  echo "⚠️  Uncommitted changes detected:"
  git status --short
  echo ""
  echo "Consider reverting temporary changes:"
  echo "  git checkout packages/blade/.storybook/react/main.ts"
  echo "  git checkout packages/blade/package.json  # CRITICAL if modified"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Kept (source files):"
echo "  .design-sync/previews/*.tsx  (29 preview files)"
echo "  .design-sync/*.md            (documentation)"
echo "  .design-sync/config.json     (build config)"
echo ""
echo "Next steps:"
echo "  1. Verify git status is clean (or only .design-sync/ changes)"
echo "  2. Commit any preview updates to design-sync branch if needed"
echo ""
