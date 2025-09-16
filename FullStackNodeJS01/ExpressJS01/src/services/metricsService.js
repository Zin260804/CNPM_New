// services/metricsService.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Comment = require('../models/Comment');
const Product = require('../models/product');

const getProductMetricsService = async (productId) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id' };
        }

        const product = await Product.findById(productId, { views: 1 }).lean();
        if (!product) return { EC: 1, EM: 'Product not found' };

        const pid = new mongoose.Types.ObjectId(productId);

        // Unique buyers (chỉ tính đơn đã thanh toán/hợp lệ)
        const purchaseAgg = await Order.aggregate([
            { $match: { status: { $in: ['paid', 'completed', 'shipped'] }, 'items.product': pid } },
            { $unwind: '$items' },
            { $match: { 'items.product': pid } },
            { $group: { _id: '$user', totalQty: { $sum: '$items.quantity' } } },
            { $group: { _id: null, uniqueBuyers: { $sum: 1 }, totalPurchasedQty: { $sum: '$totalQty' } } }
        ]);

        const uniqueBuyers = purchaseAgg[0]?.uniqueBuyers || 0;

        // Comments + unique commenters
        const commentAgg = await Comment.aggregate([
            { $match: { product: pid } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $group: { _id: null, uniqueCommenters: { $sum: 1 }, commentCount: { $sum: '$count' } } }
        ]);

        const out = {
            purchaseCount: uniqueBuyers,
            uniqueBuyers,
            commentCount: commentAgg[0]?.commentCount || 0,
            uniqueCommenters: commentAgg[0]?.uniqueCommenters || 0,
            viewCount: product.views || 0
        };

        return { EC: 0, data: out };
    } catch (e) {
        console.error('getProductMetricsService error:', e);
        return { EC: 1, EM: 'Internal server error' };
    }
};

module.exports = { getProductMetricsService };
