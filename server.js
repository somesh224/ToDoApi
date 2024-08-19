const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();

dotenv.config({
    path: './config/config.env'
});

app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.json({
    extended: true
}));

connectDB();

//GET, POST, DELETE, PUT

app.use('/api/todo/auth', require('./routes/user'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`server runnnig on port: ${PORT}`.red.underline.bold));