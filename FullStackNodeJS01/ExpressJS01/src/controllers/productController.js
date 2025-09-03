const { getProductsService } = require("../services/productService");


const getProducts = async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    const data = await getProductsService(page, limit);
    return res.status(200).json(data);
};

module.exports = {
    getProducts,
};