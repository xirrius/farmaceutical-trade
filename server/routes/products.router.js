const express = require("express");
const router = express.Router();

const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/multer");

const {
  createProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getMyProducts,
  getUserProducts,
} = require("../controllers/products.controller");
const { uploadMedia, deleteMedia } = require("../controllers/media.controller");
const { addReview, getReviews, deleteReview } = require("../controllers/reviews.controller");

router.post('/', authorize, createProduct)

router.get('/', getProducts)

router.get('/my', authorize, getMyProducts)

router.get('/user/:id', getUserProducts)

router.get('/:id', getProduct)

router.put('/:id', authorize, editProduct)

router.delete('/:id', authorize, deleteProduct)

router.post("/:product_id/media", authorize, upload.single("file"), uploadMedia)

router.delete("/:product_id/media/:media_id", authorize, deleteMedia)

router.post("/:product_id/reviews", authorize, addReview)

router.get("/:product_id/reviews", getReviews)

router.delete("/:product_id/reviews/:review_id", authorize, deleteReview)

module.exports = router