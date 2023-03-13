/**
 * The configuration for our ExpressJs application - Requirements, router, middleware, db connection, etc.
 *
 * @author MfellnerDev
 * @version 13.03.2023
 */

//all modules that are needed for this app
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require('./routes/index');
//import custom todoRouter
const todoRouter = require('./routes/todo');

//disable queries with properties that are not in the schema
mongoose.set('strictQuery', false);

//define database url, currently a local running db
const mongoDB = 'mongodb://0.0.0.0:27017/todoApp';

//wait for db to connect, logging error if occurs
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//configure practical middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//compress all routes, better response time
app.use(compression());

//extra protection middleware for web vulnerabilities
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//redirect all todo_ requests to todoRouter
app.use('/todo', todoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
