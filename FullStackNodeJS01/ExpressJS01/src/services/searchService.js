const esClient = require('../config/elasticsearch');

const searchProductsService = async (query = "", page, limit, filters = {}, sort = {}) => {
    try {
        const must = [];
        const filter = [];

        // ✅ Fuzzy search theo tên hoặc mô tả
        if (query && query.trim() !== "") {
            must.push({
                multi_match: {
                    query,
                    fields: ["name^3", "description"], // name quan trọng hơn description
                    fuzziness: "AUTO"
                }
            });
        }

        // ✅ Lọc theo category
        if (filters.category) {
            filter.push({ term: { "category.keyword": filters.category } });
        }

        // ✅ Lọc theo khoảng giá (currentPrice)
        if (filters.minPrice || filters.maxPrice) {
            filter.push({
                range: {
                    currentPrice: {
                        gte: filters.minPrice ?? 0,
                        lte: filters.maxPrice ?? 999999999
                    }
                }
            });
        }

        // ✅ Lọc theo khoảng khuyến mãi (%)
        if (filters.minPromotion || filters.maxPromotion) {
            filter.push({
                range: {
                    promotion: {
                        gte: filters.minPromotion ?? 0,
                        lte: filters.maxPromotion ?? 100
                    }
                }
            });
        }

        // ✅ Sort (views tăng dần / giảm dần)
        let sortOption = [];
        if (sort.by === "views" && sort.order) {
            sortOption.push({ views: { order: sort.order } });
        } else {
            // mặc định sắp xếp theo ngày tạo mới nhất
            sortOption.push({ createdAt: { order: "desc" } });
        }

        // ✅ Query Elasticsearch
        const result = await esClient.search({
            index: "products",
            from: (page - 1) * limit,
            size: limit,
            query: {
                bool: {
                    must: must.length > 0 ? must : [{ match_all: {} }],
                    filter
                }
            },
            highlight: {
                fields: {
                    name: {},
                    description: {}
                }
            },
            sort: sortOption
        });

        // ✅ Map dữ liệu trả về
        const hits = result.hits.hits.map(hit => ({
            id: hit._id,
            name: hit._source.name,
            description: hit._source.description,
            category: hit._source.category,
            originalPrice: hit._source.originalPrice,
            currentPrice: hit._source.currentPrice,
            promotion: hit._source.promotion,
            views: hit._source.views,
            quantity: hit._source.quantity,
            createdAt: hit._source.createdAt,
            updatedAt: hit._source.updatedAt,
            highlight: hit.highlight || {}
        }));

        return {
            EC: 0,
            EM: "Lấy sản phẩm thành công",
            data: hits,
            pagination: {
                totalProducts: result.hits.total.value,
                totalPages: Math.ceil(result.hits.total.value / limit),
                currentPage: page,
                pageSize: limit
            }
        };
    } catch (error) {
        console.error("❌ Lỗi tìm kiếm sản phẩm:", error);
        return {
            EC: 1,
            EM: "Lỗi khi tìm kiếm sản phẩm",
            data: []
        };
    }
};

module.exports = { searchProductsService };
