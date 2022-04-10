var express = require('express');
const { add } = require('../controllers/product');
var router = express.Router();

/* GET users listing. */
router.post('/add', add);

module.exports = router;
