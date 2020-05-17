# The dialogikTV API

Based on Node.js with Express.js and a MySQL database, this API servers as the main data provider for the dialogikTV frontend webapplication.

## Develop and contribute

* Clone the repository.
* Create `.env` File (see `.env.template`).
* Install node dependencies with `npm install`.
* `node app.js` (or `npm start` to run with nodemon) to run script locally.
* `git add`, `git commit` and `git push` to contribute (and always remember to `git pull` before starting the day).

## Deploy to Heroku

_tbd_

# FAQ

## Known problems when developing on Windows

* [How to get consistent lowercase table names with XAMPP on Windows](https://stackoverflow.com/questions/8550789/where-to-change-the-value-of-lower-case-table-names-2-on-windows-xampp)

## How to migrate with `.env` variables in `config/sequelize.js`

Use the [`dotenv-cli` package](https://www.npmjs.com/package/dotenv-cli):

    npx dotenv -e .env sequelize db:migrate
