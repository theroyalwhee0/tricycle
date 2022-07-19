#!/usr/bin/env bash
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi
npm publish --access=public
