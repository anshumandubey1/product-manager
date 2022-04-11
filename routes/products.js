var express = require('express');
const ProductController = require('../controllers/product');
var router = express.Router();

router.get('/', ProductController.list);
router.get('/:id', ProductController.view);
router.post('/add', ProductController.add);
router.put('/:id', ProductController.update);

module.exports = router;
