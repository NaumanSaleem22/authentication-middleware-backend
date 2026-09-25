const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    // user ki id add krdi to verify that kis user ne konsa product banaaaya
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
})

const productModel = mongoose.model("product", productSchema)

module.exports = productModel;