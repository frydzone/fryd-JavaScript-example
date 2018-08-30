var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  console.log('logging out');
  req.logout();
  res.redirect('..');
});

module.exports = router;
