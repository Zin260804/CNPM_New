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

const getProductsByCategoryService = async (category, page, limit) => {
    try {
        const totalProducts = await Product.countDocuments({ category });
        const skip = (page - 1) * limit;
        const products = await Product.find({ category })
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
                category,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Lỗi khi lấy sản phẩm theo danh mục",
        };
    }
};

const getCategoriesService = async () => {
    try {
        const categories = await Product.distinct("category"); // lấy ra mảng category không trùng
        return {
            EC: 0,
            data: categories,
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Lỗi khi lấy danh mục sản phẩm",
        };
    }
};

module.exports = {
    getProductsService,
    getProductsByCategoryService,
    getCategoriesService,
};
