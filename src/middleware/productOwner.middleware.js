const mongoose = require("mongoose");
const productModel = require("../models/product.model");

const checkProductOwner = async (req, res, next) => {
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
            })
        }

        if (product.userId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to access this product"
            });
        }

        req.product = product;

        next();
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}


module.exports = checkProductOwner;