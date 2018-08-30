const request = require('request');
const redis = require('./redisclient');
const mongoclient = require('./mongoclient');
const fryd = require('fryd');

module.exports = {
  getFrydToken: function() {
    return new Promise(function(resolve, reject) {
      redis.get('cache:fryd:token', function(err, token) {
        if (token) {
          resolve(token)
        } else {
          fryd.getTokenFromClientCred(process.env.FRYD_ID, process.env.FRYD_SECRET)
            .then(frydToken => {
              if (frydToken) {
                resolve(frydToken)
                redis.set('cache:fryd:token', frydToken, 'ex', 1440)
              } else {
                reject('fryd.getTokenFromClientCred() did not return a token')
              }
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    });
  },
  setFrydTokens: function(username, accessToken, refreshToken) {
    return new Promise(function(resolve, reject) {
      redis.set('users:' + username + ':frydAccessToken', accessToken, 'ex', 1440, function(err, value) {
        redis.set('users:' + username + ':frydRefreshToken', refreshToken, 'ex', 4320, function(err, value) {
          if (!err) {
            resolve()
          } else {
            reject(err)
          }
        })
      })
    })
  },
}
