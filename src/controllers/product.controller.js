const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const  uploadFile  = require("../services/storage.service");


// CREATE PRODUCT
const createProduct = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            })
        }

        const result = await uploadFile(req.file.buffer)

        const product = await productModel.create({
            image: result.url,
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
        })

        return res.status(201).json({
            message: "Product added successfully",
            product
        })

    } catch (error) {

        console.log(error)

        if (error.name === "ValidationError") {

            const errors = {}

            for (const field in error.errors) {
                errors[field] = error.errors[field].message
            }

            return res.status(400).json({
                message: "Validation failed",
                errors
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


// GET ALL PRODUCTS
const getProducts = async (req, res) => {

    try {

        const products = await productModel.find()

        return res.status(200).json({
            products
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


// GET SINGLE PRODUCT
const getProduct = async (req, res) => {

    try {

        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            product
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


// UPDATE PRODUCT
const updateProduct = async (req, res) => {

    try {

        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

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
            id,
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

    } catch (error) {

        console.log(error)

        if (error.name === "ValidationError") {

            const errors = {}

            for (const field in error.errors) {
                errors[field] = error.errors[field].message
            }

            return res.status(400).json({
                message: "Validation failed",
                errors
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


// DELETE PRODUCT
const deleteProduct = async (req, res) => {

    try {

        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const product = await productModel.findById(id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        await productModel.findByIdAndDelete(id)

        return res.status(200).json({
            message: "Product deleted successfully"
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}