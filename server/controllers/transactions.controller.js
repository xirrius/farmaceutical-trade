const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const { NotFoundError, BadRequestError } = require("../errors");

async function createTransaction(req, res) {
  const { product_id, quantity, transaction_type, duration = 0 } = req.body;
  const buyer_id = req.user;

  // Step 1: Retrieve the product and seller details
  const productResult = await pool.query(
    "SELECT user_id AS seller_id, price, quantity AS available_quantity FROM products WHERE product_id = $1",
    [product_id]
  );
  const product = productResult.rows[0];
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.available_quantity < quantity) {
    throw new BadRequestError("Insufficient product quantity.");
  }

  // Step 2: Calculate total amount
  const total_amount = product.price * quantity;

  // Step 4: Create the transaction record
  const result = await pool.query(
    `INSERT INTO transactions (buyer_id, seller_id, product_id, transaction_type, quantity, price, duration, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
    [
      buyer_id,
      product.seller_id,
      product_id,
      transaction_type,
      quantity,
      total_amount,
      duration,
    ]
  );

  // Step 5: Send success response
  res.status(StatusCodes.CREATED).json({
    message: "Transaction successful",
    transaction: result.rows[0],
  });
}

async function updateTransactionStatus(req, res) {
  const { transaction_id } = req.params;
  const { status } = req.body;
  const seller_id = req.user;
  console.log(req.body);
  
  if (status !== "completed" && status !== "cancelled") {
    throw new BadRequestError("Could not update the transaction.");
  }

  // Verify that the transaction exists and that the seller is the current user
  const transactionResult = await pool.query(
    "SELECT * FROM transactions WHERE transaction_id = $1 AND seller_id = $2",
    [transaction_id, seller_id]
  );
  const transaction = transactionResult.rows[0];

  if (!transaction) {
    throw new NotFoundError("Transaction not found.");
  }

  // Update the status of the transaction
  await pool.query(
    "UPDATE transactions SET status = $1 WHERE transaction_id = $2",
    [status, transaction_id]
  );

  // update inventory
  if (status === "completed") {
    if (transaction.transaction_type === "buy") {
      // For sales, update product quantity
      await pool.query(
        "UPDATE products SET quantity = quantity - $1, status = 'sold' WHERE product_id = $2",
        [transaction.quantity, transaction.product_id]
      );
    } else if (transaction.transaction_type === "rent") {
      // For rentals, create a rental entry
      const rentalStartDate = new Date(); // Start date as the current date
      const rentalEndDate = new Date(rentalStartDate);
      rentalEndDate.setDate(rentalStartDate.getDate() + transaction.duration);
      await pool.query(
        "UPDATE products SET status = 'rented' WHERE product_id = $1",
        [transaction.product_id]
      );
      await pool.query(
        `INSERT INTO rentals (transaction_id, product_id, owner_id, renter_id, rental_start_date, rental_end_date, rental_price, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')`,
        [
          transaction.transaction_id,
          transaction.product_id,
          transaction.seller_id,
          transaction.buyer_id,
          rentalStartDate,
          rentalEndDate,
          transaction.price
        ]
      );
    }
  }

  res.status(StatusCodes.OK).json({ message: `Transaction ${status}` });
}

async function getTransactions(req, res) {
  const { status, order, type } = req.query;
  const userId = req.user;

  let queryParams = [];
  // Base query to get transactions
  let baseQuery = `
    SELECT 
      t.*, 
      CASE 
        WHEN t.seller_id = $${queryParams.length + 1} THEN 'seller' 
        ELSE 'buyer' 
      END AS role 
    FROM transactions t 
    WHERE 1=1
  `;

  // Filter by status if provided
  
  // Filter by type (buyer or seller)
  if (type === "seller") {
    baseQuery += ` AND t.seller_id = $${queryParams.length + 1}`;
  } else {
    baseQuery += ` AND t.buyer_id = $${queryParams.length + 1}`;
  }
  queryParams.push(userId);
  
  if (status) {
    baseQuery += ` AND t.status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  // Order by updated_at
  const sortOrder = order && order.toLowerCase() === "asc" ? "ASC" : "DESC";
  baseQuery += ` ORDER BY t.updated_at ${sortOrder}`;

  // Execute base query
  const transactions = await pool.query(baseQuery, queryParams);

  if (transactions.rows.length === 0) {
    throw new NotFoundError("No transactions found.");
  }

  // Fetch additional details for each transaction
  const enrichedTransactions = await Promise.all(
    transactions.rows.map(async (transaction) => {
      const isSeller = transaction.role === "seller";
      const otherPartyId = isSeller
        ? transaction.buyer_id
        : transaction.seller_id;

      // Fetch other party details
      const otherPartyQuery = `SELECT user_id, name, email, city, state, profile_pic FROM users WHERE user_id = $1`;
      const otherPartyResult = await pool.query(otherPartyQuery, [
        otherPartyId,
      ]);
      const otherParty = otherPartyResult.rows[0];

      // Fetch product details
      const productQuery = `SELECT product_id, product_name, unit FROM products WHERE product_id = $1`;
      const productResult = await pool.query(productQuery, [
        transaction.product_id,
      ]);
      const product = productResult.rows[0];

      // Append other party and product details to the transaction
      return {
        ...transaction,
        otherParty,
        product,
      };
    })
  );

  return res.status(StatusCodes.OK).json(enrichedTransactions);
}

async function getTransaction(req, res) {
  const { transaction_id } = req.params;
  const userId = req.user; // Assuming the authenticated user's ID is available in req.user

  // Fetch the transaction
  const transactionResult = await pool.query(
    "SELECT * FROM transactions WHERE transaction_id = $1",
    [transaction_id]
  );

  if (transactionResult.rows.length === 0) {
    throw new NotFoundError("Transaction not found.");
  }

  const transaction = transactionResult.rows[0];

  // Determine the role (buyer or seller)
  const role = transaction.seller_id === userId ? "seller" : "buyer";

  // Fetch other party details
  const otherPartyId =
    role === "seller" ? transaction.buyer_id : transaction.seller_id;
  const otherPartyQuery = `SELECT user_id, name, email, city, state FROM users WHERE user_id = $1`;
  const otherPartyResult = await pool.query(otherPartyQuery, [otherPartyId]);
  const otherParty = otherPartyResult.rows[0];

  // Fetch product details
  const productQuery = `SELECT product_id, product_name FROM products WHERE product_id = $1`;
  const productResult = await pool.query(productQuery, [
    transaction.product_id,
  ]);
  const product = productResult.rows[0];

  // Build the enriched transaction response
  const enrichedTransaction = {
    ...transaction,
    role,
    otherParty,
    product,
  };

  return res
    .status(StatusCodes.OK)
    .json({
      message: "Transaction fetched.",
      transaction: enrichedTransaction,
    });
}

module.exports = {
  createTransaction,
  updateTransactionStatus,
  getTransactions,
  getTransaction,
};
