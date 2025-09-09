const { getProductsService, getProductsByCategoryService } = require("../services/productService");
const { searchProductsService } = require("../services/searchService");


const getProducts = async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    const data = await getProductsService(page, limit);
    return res.status(200).json(data);
};

const getProductsByCategory = async (req, res) => {
    let { category, page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    category = category || Racket;
    const data = await getProductsByCategoryService(category, page, limit);
    return res.status(200).json(data);
};

const searchProducts = async (req, res) => {
    try {
        let {
            q,
            page,
            limit,
            category,
            minPrice,
            maxPrice,
            minPromotion,
            maxPromotion,
            sortBy,
            sortOrder
        } = req.query;

        // ✅ ép kiểu an toàn
        page = Math.max(parseInt(page) || 1, 1);
        limit = Math.min(Math.max(parseInt(limit) || 5, 1), 100); // giới hạn 100 sp / page
        minPrice = minPrice !== undefined ? Math.max(parseInt(minPrice) || 0, 0) : undefined;
        maxPrice = maxPrice !== undefined ? Math.max(parseInt(maxPrice) || 0, 0) : undefined;
        minPromotion = minPromotion !== undefined ? Math.max(parseInt(minPromotion) || 0, 0) : undefined;
        maxPromotion = maxPromotion !== undefined ? Math.max(parseInt(maxPromotion) || 0, 0) : undefined;

        sortBy = sortBy || "createdAt"; // mặc định sắp xếp theo ngày tạo
        sortOrder = ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc"; // chỉ cho phép asc hoặc desc

        // ✅ gọi service
        const response = await searchProductsService(
            q,
            page,
            limit,
            {
                category,
                minPrice,
                maxPrice,
                minPromotion,
                maxPromotion
            },
            {
                by: sortBy,
                order: sortOrder
            }
        );

        return res.status(200).json(response);
    } catch (error) {
        console.error("❌ Lỗi controller searchProducts:", error);
        return res.status(500).json({ EC: 1, EM: "Internal server error", data: [] });
    }
};

module.exports = {
    searchProducts,
    getProducts,
    getProductsByCategory,
};