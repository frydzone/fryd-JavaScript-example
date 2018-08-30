var express = require('express');
var router = express.Router();

function ensureAuthenticatedViewer(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  // Denied. redirect to login
  return res.redirect('/login')
}

/* GET home page. */
router.get('/', ensureAuthenticatedViewer, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
