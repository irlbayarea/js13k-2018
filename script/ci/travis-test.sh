#!/bin/bash

if [[ -z "$TRAVIS" ]]; then
  echo "This script can only run inside of Travis build jobs."
  exit 1
fi

# The script should immediately exit if any command in the script fails.
set -e

echo ""
echo "Building sources and running tests. Running mode: ${MODE}"
echo ""

# Go to project dir
cd $(dirname $0)/../..

source script/ci/sources/mode.sh

if is_format; then
  npm run format:check
elif is_lint; then
  npm run lint
elif is_build; then
  npm run build
  npm run test
fi
