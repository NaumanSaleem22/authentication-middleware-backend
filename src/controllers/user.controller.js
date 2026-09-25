const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");



// Register User
const registerUser = async (req, res) => {
    try {

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
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


// Login User
const loginUser = async (req, res) => {
    try {

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
            process.env.JWT_SECRET,{
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login Succesful",
            token
        });

    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            message:"Something went wrong"
        })
     }
}


module.exports = {
    registerUser,
    loginUser
}