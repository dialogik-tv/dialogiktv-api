#!/bin/sh
npx dotenv -e .env sequelize db:migrate:status
echo ""
echo "run the following command to run migrations"
echo "npx dotenv -e .env sequelize db:migrate"
