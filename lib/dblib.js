const mongoclient = require('./mongoclient');

module.exports = {
  resetDb: function() {
    return new Promise(function(resolve, reject) {
      mongoclient.db.dropDatabase(function(err) {
        if (!err) {
          resolve('MongoDB: Gamitch DB was dropped');
        } else {
          reject('dblib.resetDb(): ' + err);
        }
      })
    })
  },
  findAccount: function(username) {
    return new Promise(function(resolve, reject) {
      mongoclient.users.find({ username: username }, function(err, doc) {
        if (!err && doc[0]) {
          resolve(true)
        } else {
          if (err) {
            reject(err)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  returnAccount: function(username) {
    return new Promise(function(resolve, reject) {
      mongoclient.users.find({ username: username }, function(err, doc) {
        if (!err && doc[0]) {
          resolve(doc[0])
        } else {
          if (err) {
            reject(err)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  createAccount: function(profile) {
    return new Promise(function(resolve, reject) {
      profile.numberOfLogins = 1;
      mongoclient.users.insert(profile, function(err) {
        if (err) {
          reject('dblib.createAccount(): ' + err);
        }
        resolve('Account created for: ' + profile.username)
      })
    })
  },
  addLogin: function(username) {
    return new Promise(function(resolve, reject) {
      mongoclient.users.update(
        { username: username },
        {
          $inc: {
            'numberOfLogins': 1,
          },
        },
        { upsert: false },
        function(err) {
          if (!err) {
            resolve(username + ' s numberOfLogins points were incremented by 1');
          } else {
            reject('dblib.coinflipPoints(): ' + err);
          }
        }
      );
    })
  },
};
