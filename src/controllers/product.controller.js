const productModel = require("../models/product.model");
const uploadFile = require("../services/storage.service");
const asyncHandler = require("../middleware/asyncHandler");


// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "Image is required"
        })
    }

    const result = await uploadFile(req.file.buffer)

    const product = await productModel.create({
        userId: req.user.userId,
        image: result.url,
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
    })

    return res.status(201).json({
        message: "Product added successfully",
        product
    });

});


// GET ALL PRODUCTS
const getProducts = asyncHandler(async (req, res) => {


    const products = await productModel.find({
        userId: req.user.userId
    })

    return res.status(200).json({
        message: "Products fetched successfully",
        products
    })


});


// GET SINGLE PRODUCT
const getProduct = asyncHandler(async (req, res) => {

    return res.status(200).json({
        message: "Product fetched successfully",
        product: req.product
    })

});


// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {

    const updateData = {}

    if (req.body.name !== undefined) {
        updateData.name = req.body.name
    }

    if (req.body.desc !== undefined) {
        updateData.desc = req.body.desc
    }

    if (req.body.price !== undefined) {
        updateData.price = req.body.price
    }

    if (req.file) {

        const result = await uploadFile(req.file.buffer)

        updateData.image = result.url
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
        req.product._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    )

    return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct
    })

});


// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {

    await productModel.findByIdAndDelete(req.product._id)

    return res.status(200).json({
        message: "Product deleted successfully"
    })

})


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}