#!/bin/sh

# This script is used to build the blade package.
set -e

yarn build:clean
yarn build:generate-types
# yarn build:react-prod
yarn build:react-dev
# yarn build:react-native
# yarn build:clean-declarations
