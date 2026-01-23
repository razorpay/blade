#!/bin/bash
set -e

# Default output directory
OUTPUT_DIR="storybook-site"
OTHER_ARGS=()

# Parse arguments and forward them to storybook build
while [[ $# -gt 0 ]]; do
  case $1 in
    --output-dir=*)
      OUTPUT_DIR="${1#*=}"
      shift
      ;;
    -o)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    *)
      # Forward all other arguments to storybook build
      OTHER_ARGS+=("$1")
      shift
      ;;
  esac
done

# Generate docs lockfile
yarn generate-docs-lockfile

# Build storybook with the output directory and any forwarded arguments
cross-env FRAMEWORK=REACT storybook build -c ./.storybook/react -o "$OUTPUT_DIR" --quiet "${OTHER_ARGS[@]}"

# Copy dashboard to the output directory (works for both default and Chromatic's custom dir)
node ./scripts/copyDashboard.js "$OUTPUT_DIR"

# Copy svelte storybook to the output directory (serves at /svelte route)
node ./scripts/copySvelteStorybook.js "$OUTPUT_DIR"

