#!/bin/sh

set -e

# echo "Running database migrations..."
# npx prisma migrate deploy
#
# echo "Running seed..."
# npx tsx prisma/seed.ts

echo "Starting backend..."
exec node dist/socket/src/index.js
