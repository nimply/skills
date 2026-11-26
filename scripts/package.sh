#!/usr/bin/env bash
# Builds dist/nimply.zip for uploading to claude.ai (Customize > Skills).
# The zip's top-level entry must be the skill folder itself.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
rm -f dist/nimply.zip
(cd skills && zip -r -q ../dist/nimply.zip nimply -x '*.DS_Store' 'nimply/evals/*')
echo "Built dist/nimply.zip"
unzip -l dist/nimply.zip
