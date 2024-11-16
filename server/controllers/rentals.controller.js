const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const { NotFoundError } = require("../errors");

const updateRentalStatus = async (req, res) => {
  const { rental_id } = req.params;
  const owner_id = req.user;
  const rental = await pool.query(
    "SELECT * FROM rentals WHERE rental_id = $1 AND owner_id = $2",
    [rental_id, owner_id]
  );

  if (!rental.rows[0]) {
    throw new NotFoundError("Rental entry not found.");
  }

  await pool.query(
    "UPDATE rentals SET status = 'returned' WHERE rental_id = $1",
    [rental_id]
  );

  await pool.query(
    "UPDATE products SET status = 'available' WHERE product_id = $1",
    [rental.rows[0].product_id]
  );

  return res.status(StatusCodes.OK).json({ message: "Rental entry updated." });
};

const getRentals = async (req, res) => {
  const { status, type } = req.query;
  const userId = req.user;

  let baseQuery = `SELECT * FROM rentals WHERE 1=1`;
  let queryParams = [];

  if (status) {
    baseQuery += ` AND status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  if (type === "owner") {
    baseQuery += ` AND owner_id = $${queryParams.length + 1}`;
  } else {
    baseQuery += ` AND renter_id = $${queryParams.length + 1}`;
  }
  queryParams.push(userId);

  baseQuery += ` ORDER BY updated_at DESC`;

  const result = await pool.query(baseQuery, queryParams);

  if (result.rows.length === 0) {
    throw new NotFoundError("No rental entries found.");
  }

  return res.status(StatusCodes.OK).json(result.rows);
};

const getRental = async (req, res) => {
  const { rental_id } = req.params;
  const result = await pool.query(
    "SELECT * FROM rentals WHERE rental_id = $1",
    [rental_id]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError("Rental entry not found.");
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Rental entry fetched.", rental: result.rows[0] });
};

module.exports = { updateRentalStatus, getRentals, getRental };
