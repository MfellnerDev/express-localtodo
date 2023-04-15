/**
 * The index route
 * -> "domain.com/" redirects to "domain.com/todo"
 *
 * @author MfellnerDev
 * @version 13.03.2023
 */

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/todo');
});

module.exports = router;
