const express = require('express')
const cors = require('cors')

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors())
app.use(express.json());



app.use("/", productRoutes);
app.use("/", userRoutes);

app.use(errorMiddleware);

module.exports = app;