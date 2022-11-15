const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: String,
        default: 'general',
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    }
})

module.exports = mongoose.model('Product', productSchema);