#!/bin/sh
npx dotenv -e .env sequelize db:migrate
