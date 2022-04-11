var express = require('express');
const ProductController = require('../controllers/product');
const ChangeController = require('../controllers/change');
var router = express.Router();

router.get('/', ProductController.list);
router.get('/:id', ProductController.view);
router.post('/add', ProductController.add);
router.put('/:id', ProductController.update);

router.get('/:id/changes', ChangeController.list);

module.exports = router;
