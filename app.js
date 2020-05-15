require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/user/user.router");

app.use(express.json());

console.log('App starting...');

app.use("/api", userRouter);
// // app.use("/api/tool", toolRouter);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
    console.log("Server up and running on port ", port);
});
