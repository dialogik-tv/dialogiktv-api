require("dotenv").config();
const db = require ("./models");

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

        db.sequelize.sync().then(() => {
            console.log('DB synced.');
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
