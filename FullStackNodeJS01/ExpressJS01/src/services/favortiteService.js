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

const createOrderService = async (userId, items = []) => {
    if (!userId) return { EC: 1, EM: 'Unauthorized' };
    if (!Array.isArray(items) || items.length === 0) {
        return { EC: 1, EM: 'Items is empty' };
    }

    // validate ids & quantity
    for (const it of items) {
        if (!mongoose.isValidObjectId(it.product)) {
            return { EC: 1, EM: `Invalid product id: ${it.product}` };
        }
        const qty = Number(it.quantity || 1);
        if (!Number.isFinite(qty) || qty <= 0) {
            return { EC: 1, EM: `Invalid quantity for product ${it.product}` };
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Lấy products & kiểm tra tồn kho
        const ids = items.map(i => i.product);
        const products = await Product.find({ _id: { $in: ids } }).session(session);

        const productMap = new Map(products.map(p => [p._id.toString(), p]));
        for (const it of items) {
            const p = productMap.get(it.product.toString());
            if (!p) {
                throw new Error(`Product not found: ${it.product}`);
            }
            if (p.quantity < it.quantity) {
                throw new Error(`Insufficient stock for product ${p._id}`);
            }
        }

        // Trừ tồn kho & tăng salesCount (atomic)
        for (const it of items) {
            await Product.updateOne(
                { _id: it.product, quantity: { $gte: it.quantity } },
                { $inc: { quantity: -it.quantity, salesCount: it.quantity } },
                { session }
            );
        }

        // Tạo đơn hàng
        const order = await Order.create([{
            user: userId,
            items: items.map(i => ({ product: i.product, quantity: i.quantity })),
            status: 'paid'
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return { EC: 0, data: order[0] };
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error('createOrderService error:', e);
        return { EC: 1, EM: e.message || 'Internal server error' };
    }
};

const increaseSalesService = async (productId, quantity = 1) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id' };
        }

        await Product.updateOne(
            { _id: productId },
            { $inc: { salesCount: quantity } }
        );

        return { EC: 0, data: { productId, increasedBy: quantity } };
    } catch (e) {
        console.error('increaseSalesService error:', e);
        return { EC: 1, EM: 'Internal server error' };
    }
};

// 2) Tăng số bình luận (commentsCount)
const increaseCommentsService = async (productId, count = 1) => {
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return { EC: 1, EM: 'Invalid product id' };
        }

        await Product.updateOne(
            { _id: productId },
            { $inc: { commentsCount: count } }
        );

        return { EC: 0, data: { productId, increasedBy: count } };
    } catch (e) {
        console.error('increaseCommentsService error:', e);
        return { EC: 1, EM: 'Internal server error' };
    }
};
module.exports = {
    toggleFavoriteService,
    getFavoritesService,
    increaseSalesService,
    increaseCommentsService,
};
