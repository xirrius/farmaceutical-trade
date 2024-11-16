const express = require("express");
const {
  getCategories,
  getSubCategories,
} = require("../controllers/categories.controllers");
const router = express.Router();

router.get("/", getCategories);

router.get("/:id/subcategories", getSubCategories);

module.exports = router;
