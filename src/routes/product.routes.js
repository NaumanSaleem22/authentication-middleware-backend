const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

// CREATE
router.post(
    "/create-product",
    upload.single("image"),
    createProduct
);

// GET ALL
router.get(
    "/products",
     authMiddleware,
    getProducts
);


// GET SINGLE
router.get(
    "/products/:id",
    getProduct
);


// UPDATE
router.patch(
    "/products/:id",
    upload.single("image"),
    updateProduct
);


// DELETE
router.delete(
    "/products/:id",
    deleteProduct
);


module.exports = router;