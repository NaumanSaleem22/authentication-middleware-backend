const errorMiddleware = (error, req, res, next) => {
    console.log(error);
    // Mongoose Validation Error
    if (error.name === "ValidationError") {
        const errors = {};

        for (const field in error.errors) {
            errors[field] = error.errors[field].message;
        }

        return res.status(400).json({
            message: "Validation failed xx",
            errors
        });
    }

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    // Token Expiry Error
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Token expired"
        });
    }

    // Unknown error
    return res.status(500).json({
        message: "Something went wrong"
    });
};

module.exports = errorMiddleware;