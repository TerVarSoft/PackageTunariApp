var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Mongo 
var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/tunariDB');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tunariDB');

// Logger
var logger = require('./logger/logger');

logger.log('info', 'TunariApp started!');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Mongoose models
var Product = require('./models/productModel');
var SellingItem = require('./models/sellingItemModel');
var Selling = require('./models/sellingModel');
var Client = require('./models/clientModel');

// Routers
var productRouter = require('./routes/productRoutes')(Product);
var sellingItemRouter = require('./routes/sellingItemRoutes')(SellingItem);
var sellingRouter = require('./routes/sellingRoutes')(Selling);
var clientRouter = require('./routes/clientRoutes')(Client);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/frontend')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, '../client/app')));
//app.use(express.static(path.join(__dirname, '../client')));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
//    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.43.210:9000');
    //res.setHeader('Access-Control-Allow-Origin', 'http://10.0.0.10:9000');
    res.setHeader('Access-Control-Allow-Origin', 'http://10.0.0.5:9000');
 //   res.setHeader('Access-Control-Allow-Origin', 'http://10.0.0.5:8000');
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    //res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Make our db accessible to our router
//app.use(function(req,res,next){
//    req.db = db;
//    next();
//});


app.use('/test', routes);
app.use('/users', users);
app.use('/api/products', productRouter);
app.use('/api/sellingItems', sellingItemRouter);
app.use('/api/sellings', sellingRouter);
app.use('/api/clients', clientRouter);

app.get('/', function(req, res) {
    res.sendFile('./public/frontend/index.html',{root: __dirname }); 
    //res.sendFile('./../client/app1/index.html',{root: __dirname }); 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//var server = app.listen(8000, function () {
//  var host = server.address().address;
//  var port = server.address().port;
//
//  console.log('TunariApp listening at http://%s:%s', host, port);
//});




module.exports = app;
