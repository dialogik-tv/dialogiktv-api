require("dotenv").config();
const cors = require('cors');
const express = require("express");
const app = express();

const authRouter = require("./api/auth/auth.router");
const userRouter = require("./api/user/user.router");
const toolRouter = require("./api/tool/tool.router");

// Setup CORS
app.use(cors());
app.options(process.env.CORS || '*', cors());

// Parse bodys as JSON
app.use(express.json());

console.log('App starting...');

let apiPrefix = '/api';
app.use(apiPrefix, authRouter);
app.use(apiPrefix, userRouter);
app.use(apiPrefix, toolRouter);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
    console.log("Server up and running on port ", port);
});
