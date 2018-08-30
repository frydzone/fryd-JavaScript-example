require('dotenv').config()

const mongoclient = require('./lib/mongoclient');

mongoclient.db.runCommand({ping: 1}, function(err, res) {
  if (!err && res.ok) {
    logg.info('MongoDB is up!')
  }
})

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var logg = require('./lib/logg');
var passport = require('passport');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);


var FrydStrategy = require('passport-fryd').Strategy;

passport.use(new FrydStrategy({
    clientID: process.env.FRYD_ID,
    clientSecret: process.env.FRYD_SECRET,
    callbackURL: 'http://localhost:3000/frydauthcallback',
    state: true,
  },
  function(accessToken, refreshToken, profile, done) {
    dblib.findAccount(profile.username)
      .then(res => {
        if (res) {
          cache.setFrydTokens(profile.username, accessToken, refreshToken)
            .then(() => {
              return done(null, profile)
            })
            .catch(err => {
              logg.error(err)
              return done(err)
            })
        } else {
          dblib.createAccount(profile, accessToken, refreshToken)
            .then(() => {
              cache.setFrydTokens(profile.username, accessToken, refreshToken)
                .then(res => {
                  return done(null, profile)
                })
                .catch(err => {
                  logg.error(err)
                  return done(err)
                })
            })
        }
      })
      .catch(err => logg.error(err))
  }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
