// routes/productFavorites.js
const { toggleFavorite, getMyFavorites } = require('../controllers/productFavoriteController');
const { getProductMetrics } = require('../controllers/productMetricsController');
const { getSimilarProducts } = require('../controllers/productSimilarController');
const { postViewProduct, getMyRecentlyViewed } = require('../controllers/productViewController');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();


router.use(auth);

router.post('/:id/favorite', toggleFavorite);
router.get('/:id/metrics', getProductMetrics);
router.get('/:id/similar', getSimilarProducts);
router.post('/:id/view', postViewProduct);
router.get('/me/favorites', getMyFavorites);
router.get('/me/recently-viewed', getMyRecentlyViewed);

module.exports = router;
