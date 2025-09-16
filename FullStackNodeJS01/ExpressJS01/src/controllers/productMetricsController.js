// controllers/productMetricsController.js
const { getProductMetricsService } = require('../services/metricsService');

const getProductMetrics = async (req, res) => {
    const productId = req.params.id;
    const out = await getProductMetricsService(productId);
    return res.status(out.EC === 0 ? 200 : 400).json(out);
};

module.exports = { getProductMetrics };
