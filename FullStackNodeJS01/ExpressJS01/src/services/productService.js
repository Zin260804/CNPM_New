const Product = require('../models/product');

const getProductsService = async (page, limit) => {
    try {
        const totalProducts = await Product.countDocuments();
        const skip = (page - 1) * limit;
        const products = await Product.find({})
            .skip(skip)
            .limit(limit)
            .select("-__v");

        return {
            EC: 0,
            data: products,
            pagination: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
                pageSize: limit,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Lỗi khi lấy danh sách sản phẩm",
        };
    }
};

module.exports = {
    getProductsService,
};
