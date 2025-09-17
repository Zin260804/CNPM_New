// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, index: 'text' },
    description: { type: String },
    originalPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    promotion: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    category: { type: String, index: true }, // nếu có Category model, đổi sang ObjectId ref: 'Category'
    tags: [{ type: String, index: true }],   // giúp gợi ý "tương tự"
    views: { type: Number, default: 0 },

    salesCount: { type: Number, default: 0 },        // số lượt bán
    commentsCount: { type: Number, default: 0 },     // số bình luận

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// auto-calc currentPrice theo promotion
productSchema.pre('save', function (next) {
    if (this.promotion > 0 && this.originalPrice) {
        this.currentPrice = Math.round(this.originalPrice * (1 - this.promotion / 100));
    }
    this.updatedAt = new Date();
    next();
});

// indexes hữu ích
productSchema.index({ name: 'text', description: 'text', tags: 1, category: 1 });
// gợi ý thêm:
productSchema.index({ salesCount: -1 });
productSchema.index({ commentsCount: -1 });
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
