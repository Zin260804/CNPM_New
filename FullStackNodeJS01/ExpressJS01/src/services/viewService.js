// services/viewService.js
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');

const incrementViewAndTrackService = async (userIdOrNull, productId) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id' };
        }
        const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { views: 1 } },
            { new: true, projection: { _id: 1 } }
        );
        if (!product) return { EC: 1, EM: 'Product not found' };

        if (userIdOrNull) {
            await User.updateOne(
                { _id: userIdOrNull },
                { $pull: { recentlyViewed: { product: productId } } }
            );
            await User.updateOne(
                { _id: userIdOrNull },
                {
                    $push: {
                        recentlyViewed: {
                            $each: [{ product: productId, viewedAt: new Date() }],
                            $position: 0
                        }
                    }
                }
            );
        }
        return { EC: 0, data: { ok: true } };
    } catch (e) {
        console.error('incrementViewAndTrackService error:', e);
        return { EC: 1, EM: 'Internal server error' };
    }
};

const getRecentlyViewedService = async (userId, limit = 10) => {
    try {
        const user = await User.findById(userId, { recentlyViewed: 1 });
        if (!user) return { EC: 1, EM: 'Unauthorized', data: [] };

        const slice = user.recentlyViewed.slice(0, limit);
        const ids = slice.map(x => x.product);
        const products = await Product.find({ _id: { $in: ids } }).select('-__v');
        const map = new Map(products.map(p => [p._id.toString(), p]));
        const ordered = slice.map(x => {
            const p = map.get(x.product.toString());
            return p ? { product: p, viewedAt: x.viewedAt } : null;
        }).filter(Boolean);

        return { EC: 0, data: ordered };
    } catch (e) {
        console.error('getRecentlyViewedService error:', e);
        return { EC: 1, EM: 'Internal server error', data: [] };
    }
};

module.exports = {
    incrementViewAndTrackService,
    getRecentlyViewedService,
};
