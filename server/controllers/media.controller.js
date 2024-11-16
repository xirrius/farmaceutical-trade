const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const { BadRequestError, NotFoundError, ServerError } = require("../errors");
const uploadOnCloudinary = require("../utils/cloudinary");

const uploadMedia = async (req, res) => {
  const { product_id } = req.params;

  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [product_id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found");
  }
  if (!req.file) {
    throw new BadRequestError("No file to upload.");
  }

  let fileUrl = null;
  let mediaType = null;

  const mimeType = req.file.mimetype;
  if (mimeType.startsWith("image/")) {
    mediaType = "image";
  } else if (mimeType.startsWith("video/")) {
    mediaType = "video";
  } else {
    throw new BadRequestError(
      "Invalid file type. Only images and videos are allowed."
    );
  }

  const localFilePath = req.file.path;
  fileUrl = await uploadOnCloudinary(localFilePath);

  if (!fileUrl) {
    throw new ServerError("File upload failed.");
  }

  fs.unlink(localFilePath, (err) => {
    if (err) {
      console.error("Failed to delete local file:", err);
    }
  });

  const result = await pool.query(
    "INSERT INTO media (product_id, media_type, url) VALUES ($1, $2, $3) RETURNING *",
    [product_id, mediaType, fileUrl]
  );
  return res.status(StatusCodes.CREATED).json(result.rows[0]);
};

const deleteMedia = async (req, res) => {
  const { product_id, media_id } = req.params;
  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [product_id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found");
  }
  const media = await pool.query(
    "SELECT * FROM media WHERE media_id = $1",
    [media_id]
  );
  if (!media.rows[0]) {
    throw new NotFoundError("Media not found");
  }
  await pool.query("DELETE FROM media WHERE media_id = $1", [media_id])
  return res.status(StatusCodes.OK).json({message: "Media deleted."})
};

module.exports = { uploadMedia, deleteMedia };
