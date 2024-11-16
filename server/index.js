require("dotenv").config();
require("express-async-errors");
const express = require("express");

// extra security packages
const cors = require("cors");

const { app, server } = require("./utils/socket");

const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");

const userRoutes = require("./routes/users.router");
const productRoutes = require("./routes/products.router");
const categoryRoutes = require("./routes/categories.router");
const transactionRoutes = require("./routes/transactions.router");
const rentalRoutes = require("./routes/rentals.router");
const messageRoutes = require("./routes/messages.router");

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);
app.use("/rentals", rentalRoutes);
app.use("/messages", messageRoutes);

//error handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is starting on port 5000.`);
  });
};

start();
