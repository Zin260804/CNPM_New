const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    originalPrice: { type: Number, required: true }, // Giá gốc
    currentPrice: { type: Number, required: true },  // Giá hiện tại
    promotion: { type: Number, default: 0 }, // Khuyến mãi (%)
    quantity: { type: Number, default: 0 },
    category: { type: String },
    views: { type: Number, default: 0 }, // Lượt xem
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware: tự tính currentPrice nếu có promotion
productSchema.pre('save', function (next) {
    if (this.promotion > 0 && this.originalPrice) {
        this.currentPrice = Math.round(this.originalPrice * (1 - this.promotion / 100));
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;