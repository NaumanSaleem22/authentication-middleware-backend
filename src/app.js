const express = require('express')
const cors = require('cors')
const app = express();
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");

app.use(cors())
app.use(express.json());



app.use("/", productRoutes);
app.use("/", userRoutes);

module.exports = app;