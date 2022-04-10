var express = require('express');
const { signUp, login } = require('../controllers/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', signUp);

router.post('/login', login);

module.exports = router;
