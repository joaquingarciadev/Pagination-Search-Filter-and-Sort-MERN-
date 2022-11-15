const router = require('express').Router();
const {
    addProduct,
    getProducts,
} = require('../controllers/product.controller');

router.route('/products/all').get(getProducts);
router.route('/products/add').post(addProduct);

module.exports = router;