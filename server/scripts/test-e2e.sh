#!/usr/bin/env bash
set -e

SUPABASE_RUNNING=$(supabase status 2>/dev/null | grep -c "API URL" || true)

if [ "$SUPABASE_RUNNING" -eq 0 ]; then
  echo "Starting Supabase..."
  supabase start --exclude realtime,storage-api,imgproxy,inbucket,studio,edge-runtime --ignore-health-check
  STARTED_BY_US=true
fi

# echo "Resetting Database..."
# supabase db reset

cleanup() {
  if [ "$STARTED_BY_US" = true ]; then
    echo "Stopping Supabase..."
    supabase stop
  fi
}
trap cleanup EXIT

vitest run --config vitest.e2e.config.ts