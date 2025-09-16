// controllers/productSimilarController.js
const { getSimilarProductsService } = require('../services/similarService');

const getSimilarProducts = async (req, res) => {
    const productId = req.params.id;
    let { limit } = req.query;
    limit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const out = await getSimilarProductsService(productId, limit);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

module.exports = { getSimilarProducts };
