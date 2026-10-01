const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const checkProductOwner = require("../middleware/productOwner.middleware");
const findProduct = require("../middleware/findProduct.middleware");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin, 
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

// Admin GET
router.get(
    "/admin/products",
    authMiddleware,
    adminMiddleware,
    getAllProductsAdmin
);

// Admin get single product
router.get(
    "/admin/products/:id",
    authMiddleware,
    adminMiddleware,
    findProduct,
    getProduct
);

// Admin Update
router.patch(
    "/admin/products/:id",
    authMiddleware,
    adminMiddleware,
    findProduct,
    upload.single("image"),
    updateProduct
);

// Admin Update
router.delete(
    "/admin/delete/:id",
    authMiddleware,
    adminMiddleware,
    findProduct,
    deleteProduct
);



module.exports = router;
