const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }, // nếu cần
    createdAt: { type: Date, default: Date.now }
});
commentSchema.index({ product: 1, user: 1, createdAt: -1 });
module.exports = mongoose.model('Comment', commentSchema);