const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],
    status: { type: String, default: 'paid' }, // hoặc enum
    createdAt: { type: Date, default: Date.now }
});
orderSchema.index({ 'items.product': 1, status: 1 });
module.exports = mongoose.model('Order', orderSchema);
