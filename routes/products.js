var express = require('express');
const { add, update, list } = require('../controllers/product');
var router = express.Router();

router.get('/', list);
router.post('/add', add);
router.put('/:id', update);

module.exports = router;
