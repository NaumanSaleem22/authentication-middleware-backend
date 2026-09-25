const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const checkProductOwner = require("../middleware/productOwner.middleware");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// CREATE
router.post(
    "/create-product",
    authMiddleware,
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
    authMiddleware,
    checkProductOwner,
    getProduct
);


// UPDATE
router.patch(
    "/products/:id",
    authMiddleware,
    checkProductOwner,
    upload.single("image"),
    updateProduct
);


// DELETE
router.delete(
    "/products/:id",
    authMiddleware,
    checkProductOwner,
    deleteProduct
);


module.exports = router;