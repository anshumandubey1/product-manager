var express = require('express');
const ProductController = require('../controllers/product');
const ChangeController = require('../controllers/change');
const { isLoggedIn, isAdmin } = require('../helpers/jwt');
var router = express.Router();

router.get('/', ProductController.list);
router.get('/:id', ProductController.view);
router.post('/add', isLoggedIn, isAdmin, ProductController.add);
router.put('/:id', isLoggedIn, isAdmin, ProductController.update);

router.get('/:id/changes', isLoggedIn, isAdmin, ChangeController.list);
router.get('/:id/changes/:cid', ChangeController.view);

module.exports = router;
