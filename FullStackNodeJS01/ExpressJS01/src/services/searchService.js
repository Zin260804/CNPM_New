const esClient = require('../config/elasticsearch');

const searchProductsService = async (query = "", page, limit, filters = {}, sort = {}) => {
    try {
        const must = [];
        const filter = [];

        // ✅ Fuzzy search + prefix fallback
        // 🔍 Search logic
        if (query && query.trim() !== "") {
            must.push({
                bool: {
                    should: [
                        // 1. Ưu tiên match chính xác theo tên
                        {
                            match: {
                                "name": {
                                    query,
                                    boost: 3
                                }
                            }
                        },
                        // 2. Fuzzy search (sai chính tả)
                        {
                            multi_match: {
                                query,
                                fields: ["name^3", "description"],
                                fuzziness: "AUTO"
                            }
                        },
                        // 3. Prefix search (autocomplete: "yo" → "Yonex")
                        {
                            match_phrase_prefix: {
                                "name": {
                                    query,
                                    boost: 2
                                }
                            }
                        },
                        // 4. Wildcard fallback ("on" → "Yonex")
                        {
                            wildcard: {
                                "name.keyword": `*${query.toLowerCase()}*`
                            }
                        }
                    ]
                }
            });
        }

        // ✅ Lọc theo category
        if (filters.category) {
            filter.push({ term: { "category.keyword": filters.category } });
        }

        // ✅ Lọc theo khoảng giá
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

        // ✅ Lọc theo khuyến mãi
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

        // ✅ Sort
        let sortOption = [];
        if (sort.by === "views" && sort.order) {
            sortOption.push({ views: { order: sort.order } });
        } else {
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
            ...hit._source,
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
