const Product = require('./models/product');
const esClient = require('./config/elasticsearch');

async function syncProductsToES() {
    try {
        const products = await Product.find({});
        console.log(`🔄 Đang sync ${products.length} sản phẩm lên Elasticsearch...`);

        for (const product of products) {
            await esClient.index({
                index: 'products',
                id: product._id.toString(),
                document: {
                    name: product.name,
                    description: product.description,
                    originalPrice: product.originalPrice,
                    currentPrice: product.currentPrice,
                    promotion: product.promotion,
                    quantity: product.quantity,
                    category: product.category,
                    views: product.views,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                }
            });
        }

        await esClient.indices.refresh({ index: 'products' });
        console.log("✅ Sync dữ liệu thành công!");
    } catch (err) {
        console.error("❌ Lỗi sync:", err);
    }
}

// 👉 Export đúng cách
module.exports = syncProductsToES;
