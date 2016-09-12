var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var debug        = require('debug')('server');
var http         = require('http');
var mongoose     = require('mongoose'); 

var routes       = require('./routes/index');

// ======================================
// start express app 
//
var app = express();


// ======================================
// view engine setup 
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ======================================
// general setup 
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ======================================
// middlewares 
//


// ======================================
// routes 
//
app.use('/', routes);


// ======================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// ======================================
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


// ======================================
// create server 

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
var server = http.createServer(app);


// ======================================
// connect to mongodb and start server
mongoose.connect(process.env.H4A_DATABASE, function(err) {
    if(err) {
        debug('connection error', err);
    } else {
        debug('connection successful');
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    }
});


// ======================================
// functions

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}