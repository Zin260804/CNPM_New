const { toggleFavorite, getMyFavorites, increaseSales, increaseComments } = require('../controllers/productFavoriteController');
const { getProductStats } = require('../controllers/productMetricsController');
const { getSimilarProducts } = require('../controllers/productSimilarController');
const { postViewProduct, getMyRecentlyViewed } = require('../controllers/productViewController');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/:id/favorite', toggleFavorite);
router.get('/:id/metrics', getProductStats);
router.get('/:id/similar', getSimilarProducts);
router.post('/:id/view', postViewProduct);
router.get('/me/favorites', getMyFavorites);
router.get('/me/recently-viewed', getMyRecentlyViewed);
router.post('/:id/increase-sales', increaseSales);
router.post('/:id/increase-comments', increaseComments);
module.exports = router;
