const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    recentlyViewed: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        viewedAt: { type: Date, default: Date.now }
    }]
});
userSchema.index({ 'recentlyViewed.viewedAt': -1 });

// Fix OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;