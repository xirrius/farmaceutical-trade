const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const pool = require("../database/db");

const addReview = async (req, res) => {
  const { rating, review_text } = req.body;
  const { product_id } = req.params;

  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [product_id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found.");
  }
  const result = await pool.query(
    "INSERT INTO reviews (product_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *",
    [product_id, req.user, rating, review_text]
  );
  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Review added", review: result.rows[0] });
};

const getReviews = async (req, res) => {
  const { product_id } = req.params;

  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [product_id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found.");
  }

  const result = await pool.query(
    "SELECT * FROM reviews WHERE product_id = $1",
    [product_id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("No reviews found.");
  }

  const reviewsWithDetails = await Promise.all(
    result.rows.map(async (item) => {
      const userResult = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [item.user_id]
      );
      return {
        ...item,
        user: userResult.rows[0] || null,
      };
    })
  );

  return res.status(StatusCodes.OK).json(reviewsWithDetails);
};

const deleteReview = async (req, res) => {
  const { product_id, review_id } = req.params;

  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [product_id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found.");
  }

  const result = await pool.query(
    "SELECT * FROM reviews WHERE review_id = $1 AND user_id = $2",
    [review_id, req.user]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("Review not found.");
  }

  await pool.query("DELETE FROM reviews WHERE review_id = $1", [review_id]);
  return res.status(StatusCodes.OK).json({ message: "Review deleted." });
};

module.exports = { addReview, getReviews, deleteReview };
