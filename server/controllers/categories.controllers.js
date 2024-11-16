const pool = require("../database/db");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getCategories = async (req, res) => {
  const categories = await pool.query("SELECT * FROM categories");
  if (categories.rows.length === 0) {
    throw new NotFoundError("No categories found.");
  }
  return res.status(StatusCodes.OK).json(categories.rows);
};

const getSubCategories = async (req, res) => {
  const { id } = req.params;
  const subcategories = await pool.query(
    "SELECT * FROM subcategories WHERE category_id = $1",
    [id]
  );
  if (subcategories.rows.length === 0) {
    throw new NotFoundError("No sub-categories found.");
  }
  return res.status(StatusCodes.OK).json(subcategories.rows);
};

module.exports = { getCategories, getSubCategories };
