var express = require('express');
const { add, update } = require('../controllers/product');
var router = express.Router();

/* GET users listing. */
router.post('/add', add);
router.put('/:id', update);

module.exports = router;
