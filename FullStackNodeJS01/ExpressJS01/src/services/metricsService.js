// services/productMetricsService.js
const mongoose = require('mongoose');
const Product = require('../models/product');

const getProductStatsService = async (productId) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id', data: null };
        }

        const product = await Product.findById(productId, { salesCount: 1, commentsCount: 1 });
        if (!product) {
            return { EC: 1, EM: 'Product not found', data: null };
        }

        return {
            EC: 0,
            data: {
                productId: productId,
                salesCount: product.salesCount || 0,
                commentsCount: product.commentsCount || 0,
            },
        };
    } catch (e) {
        console.error('getProductStatsService error:', e);
        return { EC: 1, EM: 'Internal server error', data: null };
    }
};

module.exports = { getProductStatsService };
