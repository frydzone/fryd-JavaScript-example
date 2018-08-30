var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', {
    title: 'Login to snake-fryd',
    register: 'https://fryd.zone/register',
  })
});

module.exports = router;
