require('newrelic');
require("dotenv").config();
const cors = require('cors');
const express = require("express");
const app = express();

const authRouter       = require("./api/auth/auth.router");
const userRouter       = require("./api/user/user.router");
const toolRouter       = require("./api/tool/tool.router");
const tagRouter        = require("./api/tag/tag.router");
const tutorialRouter   = require("./api/tutorial/tutorial.router");
const collectionRouter = require("./api/collection/collection.router");
const categoryRouter   = require("./api/category/category.router");

// Setup CORS
app.use(cors());
app.options(process.env.CORS || '*', cors());

// Parse bodys as JSON
app.use(express.json());

console.log('App starting...');

if(typeof process.env.NODE_ENV == 'undefined' || process.env.NODE_ENV == 'development') {
    console.log(`[Database] ${process.env.DB_USER}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`);
}

let apiPrefix = '/api';
app.use(apiPrefix, authRouter);
app.use(apiPrefix, userRouter);
app.use(apiPrefix, toolRouter);
app.use(apiPrefix, tagRouter);
app.use(apiPrefix, tutorialRouter);
app.use(apiPrefix, collectionRouter);
app.use(apiPrefix, categoryRouter);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
    console.log("Server up and running on port ", port);
});
