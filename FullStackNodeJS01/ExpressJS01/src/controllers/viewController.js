// controllers/productViewController.js
const { incrementViewAndTrackService, getRecentlyViewedService } = require('../services/viewService');

const postViewProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user?._id || null; // authOptional
    const out = await incrementViewAndTrackService(userId, productId);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

const getMyRecentlyViewed = async (req, res) => {
    let { limit } = req.query;
    limit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const userId = req.user?._id;
    if (!userId) return res.status(200).json({ EC: 0, data: [] }); // guest dùng localStorage
    const out = await getRecentlyViewedService(userId, limit);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

module.exports = { postViewProduct, getMyRecentlyViewed };
