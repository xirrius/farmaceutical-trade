const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const { NotFoundError, BadRequestError } = require("../errors");

const createProduct = async (req, res) => {
  const {
    category_id,
    subcategory_id,
    product_name,
    description,
    price,
    quantity,
    unit,
    condition,
    status,
  } = req.body;
  if (
    !category_id ||
    !subcategory_id ||
    !product_name ||
    !description ||
    !price ||
    !quantity ||
    !unit ||
    !condition ||
    !status
  ) {
    throw new BadRequestError("Please provide all the necessary information.");
  }
  const result = await pool.query(
    `INSERT INTO products (user_id, category_id, subcategory_id, product_name, description, price, quantity, unit, condition, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
    [
      req.user,
      category_id,
      subcategory_id,
      product_name,
      description,
      price,
      quantity,
      unit,
      condition,
      status,
    ]
  );
  res.status(StatusCodes.CREATED).json({
    message: "Product added successfully",
    product: result.rows[0],
  });
};

const getProducts = async (req, res) => {
  const {
    page,
    limit,
    sortBy = "created_at",
    order = "desc",
    search,
    category,
    subcategory,
    condition,
    status,
    maxPrice,
    maxQuantity,
  } = req.query;

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 5;
  const offset = (pageNum - 1) * limitNum;

  let countQuery = "SELECT COUNT(*) FROM products WHERE 1=1";
  let baseQuery =
    "SELECT products.* FROM products JOIN users ON products.user_id = users.user_id WHERE 1=1";

  let queryParams = [];
  let countParams = [];

  if (search) {
    baseQuery += ` AND product_name ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${search}%`);

    countQuery += ` AND product_name ILIKE $${countParams.length + 1}`;
    countParams.push(`%${search}%`);
  }

  if (category) {
    baseQuery += ` AND category_id = $${queryParams.length + 1}`;
    queryParams.push(category);
    countQuery += ` AND category_id = $${countParams.length + 1}`;
    countParams.push(category);
  }
  if (subcategory) {
    baseQuery += ` AND subcategory_id = $${queryParams.length + 1}`;
    queryParams.push(subcategory);
    countQuery += ` AND subcategory_id = $${countParams.length + 1}`;
    countParams.push(subcategory);
  }
  if (condition) {
    baseQuery += ` AND LOWER(condition) = LOWER($${queryParams.length + 1})`;
    queryParams.push(condition);
    countQuery += ` AND condition = $${countParams.length + 1}`;
    countParams.push(condition);
  }
  if (status) {
    baseQuery += ` AND LOWER(status) = LOWER($${queryParams.length + 1})`;
    queryParams.push(status);
    countQuery += ` AND status = $${countParams.length + 1}`;
    countParams.push(status);
  }
  if (maxPrice) {
    baseQuery += ` AND price <= $${queryParams.length + 1}`;
    queryParams.push(maxPrice);
    countQuery += ` AND price <= $${countParams.length + 1}`;
    countParams.push(maxPrice);
  }

  if (maxQuantity) {
    baseQuery += ` AND quantity <= $${queryParams.length + 1}`;
    queryParams.push(maxQuantity);
    countQuery += ` AND quantity <= $${countParams.length + 1}`;
    countParams.push(maxQuantity);
  }

  if (sortBy) {
    const sortOrder = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";
    baseQuery += ` ORDER BY products.${sortBy} ${sortOrder}`;
  } else {
    baseQuery += ` ORDER BY products.created_at ASC`;
  }

  baseQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(limitNum, offset);

  console.log(baseQuery);

  const result = await pool.query(baseQuery, queryParams);
  const totalResult = await pool.query(countQuery, countParams);
  if (!result.rows[0]) {
    throw new NotFoundError("No products found.");
  }

  const productsWithDetails = await Promise.all(
    result.rows.map(async (product) => {
      const userResult = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [product.user_id]
      );
      const categoryResult = await pool.query(
        "SELECT * FROM categories WHERE category_id = $1",
        [product.category_id]
      );
      const subcategoryResult = await pool.query(
        "SELECT * FROM subcategories WHERE subcategory_id = $1",
        [product.subcategory_id]
      );
      const mediaResult = await pool.query(
        "SELECT * FROM media WHERE product_id = $1",
        [product.product_id]
      );

      return {
        ...product,
        user: userResult.rows[0] || null,
        category: categoryResult.rows[0] || null,
        subcategory: subcategoryResult.rows[0] || null,
        media: mediaResult.rows || [],
      };
    })
  );

  res.status(StatusCodes.OK).json({
    result: productsWithDetails,
    total: parseInt(totalResult.rows[0].count),
  });
};

const getMyProducts = async (req, res) => {
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    req.user,
  ]);

  if (!user.rows[0]) {
    throw new NotFoundError("User not found.");
  }

  const result = await pool.query("SELECT * FROM products WHERE user_id = $1", [
    req.user,
  ]);

  if (result.rows.length === 0) {
    throw new NotFoundError("No products found.");
  }

  const productsWithDetails = await Promise.all(
    result.rows.map(async (product) => {
      const userResult = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [product.user_id]
      );
      const categoryResult = await pool.query(
        "SELECT * FROM categories WHERE category_id = $1",
        [product.category_id]
      );
      const subcategoryResult = await pool.query(
        "SELECT * FROM subcategories WHERE subcategory_id = $1",
        [product.subcategory_id]
      );
      const mediaResult = await pool.query(
        "SELECT * FROM media WHERE product_id = $1",
        [product.product_id]
      );

      return {
        ...product,
        user: userResult.rows[0] || null,
        category: categoryResult.rows[0] || null,
        subcategory: subcategoryResult.rows[0] || null,
        media: mediaResult.rows || [],
      };
    })
  );

  return res.status(200).json(productsWithDetails);
};

const getUserProducts = async (req, res) => {
  const { id } = req.params;

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

  if (!user.rows[0]) {
    throw new NotFoundError("User not found.");
  }

  const products = await pool.query(
    "SELECT * FROM products WHERE user_id = $1",
    [id]
  );

  if (products.rows.length === 0) {
    throw new NotFoundError("No products found.");
  }

  return res.status(200).json(products.rows);
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found.");
  }

  const userResult = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [product.rows[0].user_id]
  );
  const categoryResult = await pool.query(
    "SELECT * FROM categories WHERE category_id = $1",
    [product.rows[0].category_id]
  );
  const subcategoryResult = await pool.query(
    "SELECT * FROM subcategories WHERE subcategory_id = $1",
    [product.rows[0].subcategory_id]
  );
  const mediaResult = await pool.query(
    "SELECT * FROM media WHERE product_id = $1",
    [product.rows[0].product_id]
  );

  const productWithDetails = {
    ...product.rows[0],
    user: userResult.rows[0] || null,
    category: categoryResult.rows[0] || null,
    subcategory: subcategoryResult.rows[0] || null,
    media: mediaResult.rows || [],
  };

  return res.status(StatusCodes.OK).json(productWithDetails);
};

const editProduct = async (req, res) => {
  const {
    category_id,
    subcategory_id,
    product_name,
    description,
    price,
    quantity,
    unit,
    condition,
    status,
  } = req.body;
  if (
    !category_id ||
    !subcategory_id ||
    !product_name ||
    !description ||
    !price ||
    !quantity ||
    !unit ||
    !condition ||
    !status
  ) {
    throw new BadRequestError("Please provide all the necessary information.");
  }
  const { id } = req.params;
  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found.");
  }
  await pool.query(
    "UPDATE products SET category_id = $1, subcategory_id = $2, product_name = $3, description = $4, price = $5, quantity = $6, unit = $7, condition = $8, status = $9 WHERE product_id = $10",
    [
      category_id,
      subcategory_id,
      product_name,
      description,
      price,
      quantity,
      unit,
      condition,
      status,
      id,
    ]
  );
  res.status(StatusCodes.OK).json({ message: "Product updated successfully." });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [id]
  );
  if (!product.rows[0]) {
    throw new NotFoundError("Product not found.");
  }
  await pool.query("DELETE FROM products WHERE product_id = $1", [id]);
  return res
    .status(StatusCodes.OK)
    .json({ message: "Product deleted successfully." });
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getMyProducts,
  getUserProducts,
};
