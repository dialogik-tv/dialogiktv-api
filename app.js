require("dotenv").config();
const express = require("express");
const app = express();
const authRouter = require("./api/auth/auth.router");
const userRouter = require("./api/user/user.router");
const toolRouter = require("./api/tool/tool.router");

app.use(express.json());

console.log('App starting...');

let apiPrefix = '/api';
app.use(apiPrefix, authRouter);
app.use(apiPrefix, userRouter);
app.use(apiPrefix, toolRouter);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
    console.log("Server up and running on port ", port);
});
