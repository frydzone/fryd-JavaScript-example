const mongojs = require('mongojs');

const db = mongojs(process.env.MONGO_URI);

module.exports = {
  close: () => {
    db.close()
  },
  users: db.collection('users'),
  db: db,
}
