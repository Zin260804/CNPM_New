// services/similarService.js
const mongoose = require('mongoose');
const Product = require('../models/product');

const getSimilarProductsService = async (productId, limit = 10) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id', data: [] };
        }
        const p = await Product.findById(productId).lean();
        if (!p) return { EC: 1, EM: 'Product not found', data: [] };

        const q = {
            _id: { $ne: p._id },
            $or: [
                { category: p.category },
                { tags: { $in: p.tags || [] } }
            ]
        };

        const data = await Product.find(q)
            .sort({ views: -1, updatedAt: -1 })
            .limit(limit)
            .select('-__v');

        return { EC: 0, data };
    } catch (e) {
        console.error('getSimilarProductsService error:', e);
        return { EC: 1, EM: 'Internal server error', data: [] };
    }
};

module.exports = { getSimilarProductsService };
