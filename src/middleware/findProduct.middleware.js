const mongoose = require("mongoose");
const productModel = require("../models/product.model");

const findProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        req.product = product;

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = findProduct;