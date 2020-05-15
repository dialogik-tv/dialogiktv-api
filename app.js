require("dotenv").config();
const express = require("express");
const app = express();
// const userRouter = require("./api/users/user.router");
const db = require ("./models");

// console.log(db);

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
//     host: process.env.MYSQL_HOST,
//     dialect: 'mysql'
// });

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

db.sequelize.sync().then(() => {
    console.log('DB synced.');
});

// app.use(express.json());
//
// console.log('App starting...');
//
// app.use("/api/users", userRouter);
//
// const port = process.env.PORT || 3000;
// const host = process.env.HOST || '0.0.0.0';
// app.listen(port, host, () => {
//     console.log("Server up and running on port ", port);
// });
