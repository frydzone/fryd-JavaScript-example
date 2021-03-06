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
var redis = require('./lib/redisclient');
var dblib = require('./lib/dblib');
var cache = require('./lib/cache');

var Fryd = require('fryd');

var fryd = new Fryd();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var frydLoginRouter = require('./routes/frydlogin');
var frydAuthCallbackRouter = require('./routes/frydauthcallback');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var FrydStrategy = require('passport-fryd').Strategy;

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// TODO secure cookie

var sess = {
  store: new RedisStore({
    client: redis,
  }),
  resave: false,
  saveUninitialized: true,
  secret: 'banana secret',
  name: 'sessionId',
  cookie: {
    maxAge: 86400000,
  },
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  user = user.username
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  dblib.returnAccount(user)
    .then(account => {done(null, account)})
    .catch(err => {logg.error(err)})
});

passport.use(new FrydStrategy({
    clientID: process.env.FRYD_ID,
    clientSecret: process.env.FRYD_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, done) {
    dblib.findAccount(profile.username)
      .then(res => {
        if (res) {
          cache.setFrydTokens(profile.username, accessToken, refreshToken)
            .then(() => {
              dblib.addLogin(profile.username)
                .then((res) => {
                  logg.info(res)
                })
                .catch(err => {
                  logg.error(err)
                })
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
                  cache.getFrydToken()
                    .then(appToken => {
                      fryd.postTrophySuccess(accessToken, appToken, process.env.LOCATION_ID, process.env.LOGIN_TROPHY)
                        .then(() => {
                          logg.info('Trophy was awarded to ' + profile.username)
                        })
                        .catch(err => {
                          logg.error(err)
                        })
                    })
                    .catch(err => {
                      logg.error(err)
                    })
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

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/frydlogin', frydLoginRouter);
app.use('/frydauthcallback', frydAuthCallbackRouter);

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
