#!/bin/sh

npx sequelize-cli db:migrate

node ./app.js
