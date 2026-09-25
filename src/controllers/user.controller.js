const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");


// Register User
const registerUser = asyncHandler(async (req, res) => {

    // Data daala 
    const { name, email, password } = req.body;

    // Check fields are there or not
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    // Check if user already esists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            message: "Email already registered"
        })
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword
    });

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});


// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // find user
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email "
        });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Password incorrect"
        });
    }


    // Create JWT
    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET, {
        expiresIn: "1d"
    }
    );

    return res.status(200).json({
        message: "Login Succesful",
        token
    });
});


// Get All Users

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await userModel.find()

    return res.status(200).json({
        users
    })
})


module.exports = {
    registerUser,
    loginUser,
    getAllUsers
}