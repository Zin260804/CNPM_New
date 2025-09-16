// services/favoriteService.js
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');

const toggleFavoriteService = async (userId, productId) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id' };
        }

        const exists = await Product.exists({ _id: productId });
        if (!exists) return { EC: 1, EM: 'Product not found' };

        const user = await User.findById(userId, { favorites: 1 });
        if (!user) return { EC: 1, EM: 'Unauthorized' };

        const idx = user.favorites.findIndex(p => p.toString() === productId);
        let favored;
        if (idx >= 0) {
            user.favorites.splice(idx, 1);
            favored = false;
        } else {
            user.favorites.push(productId);
            favored = true;
        }
        await user.save();

        return { EC: 0, data: { favored } };
    } catch (e) {
        console.error('toggleFavoriteService error:', e);
        return { EC: 1, EM: 'Internal server error' };
    }
};

const getFavoritesService = async (userId, page = 1, limit = 10) => {
    try {
        const user = await User.findById(userId, { favorites: 1 });
        if (!user) return { EC: 1, EM: 'Unauthorized', data: [] };

        const total = user.favorites.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;

        const pageIds = user.favorites.slice(start, end);
        // Lấy products và giữ đúng thứ tự theo pageIds
        const products = await Product.find({ _id: { $in: pageIds } }).select('-__v');
        const map = new Map(products.map(p => [p._id.toString(), p]));
        const ordered = pageIds.map(id => map.get(id.toString())).filter(Boolean);

        return {
            EC: 0,
            data: ordered,
            pagination: { totalProducts: total, totalPages, currentPage: page, pageSize: limit }
        };
    } catch (e) {
        console.error('getFavoritesService error:', e);
        return { EC: 1, EM: 'Internal server error', data: [] };
    }
};

module.exports = {
    toggleFavoriteService,
    getFavoritesService,
};
