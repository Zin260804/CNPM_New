const { getProductStatsService } = require('../services/metricsService');

const getProductStats = async (req, res) => {
    const productId = req.params.id;
    const out = await getProductStatsService(productId);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

module.exports = {
    getProductStats,
};
