// controllers/productFavoriteController.js
const { toggleFavoriteService, getFavoritesService } = require('../services/favortiteService');

const toggleFavorite = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id;
    const out = await toggleFavoriteService(userId, productId);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

const getMyFavorites = async (req, res) => {
    let { page, limit } = req.query;
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const userId = req.user._id;
    const out = await getFavoritesService(userId, page, limit);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

module.exports = { toggleFavorite, getMyFavorites };
