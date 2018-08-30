// TODO add a check of the state parameter to prevent cross-site scripting

var express = require('express');
var router = express.Router();
var passport = require('passport');

/* Let Passport handle auth. */
router.get('/', passport.authenticate('fryd', { failureRedirect: '..' }),
  function(req, res) {
    res.redirect('..');
  }
);

module.exports = router;
