const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();

app.use((req, res, next) => {
    console.log("middleware run");
    req.title = "mishra";
    next();
});

app.use(morgan('dev'));

dotenv.config({
    path: './config/config.env'
});

connectDB();

//GET, POST, DELETE, PUT

app.get('/todo', (req, res) => {

    res.status(200).json({
        "name": "somesh",
        "title": req.title
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`server runnnig on port: ${PORT}`.red.underline.bold));