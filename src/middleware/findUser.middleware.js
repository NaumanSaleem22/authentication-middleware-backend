const mongoose = require("mongoose");
const userModel = require("../models/user.model");


const findUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid User ID"
            });
        }

        const user = await userModel.findById(id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        req.userToManage = user;

        next();
    }
    catch (error) { 
        next(error);
    }
}

module.exports = findUser;