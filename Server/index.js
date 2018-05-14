const Push = require('./push');
const express = require('express');
const webpush = require('web-push');

const app = express();

app.listen(8081);

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

Push(app, '/');