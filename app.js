require("dotenv").config();
const cors = require('cors');
const express = require("express");
const app = express();

const authRouter = require("./api/auth/auth.router");
const userRouter = require("./api/user/user.router");
const toolRouter = require("./api/tool/tool.router");

// Setup CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://dialogiktv.herokuapp.com'
];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
// app.options('*', cors());

// Parse bodys as JSON
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
