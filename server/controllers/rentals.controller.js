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

  let queryParams = [];

  let baseQuery = `
    SELECT 
      t.*, 
      CASE 
        WHEN t.owner_id = $${queryParams.length + 1} THEN 'owner' 
        ELSE 'renter' 
      END AS role 
    FROM rentals t 
    WHERE 1=1
  `;

  if (type === "owner") {
    baseQuery += ` AND owner_id = $${queryParams.length + 1}`;
  } else {
    baseQuery += ` AND renter_id = $${queryParams.length + 1}`;
  }
  queryParams.push(userId);

  if (status) {
    baseQuery += ` AND status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  baseQuery += ` ORDER BY updated_at DESC`;

  const result = await pool.query(baseQuery, queryParams);

  if (result.rows.length === 0) {
    throw new NotFoundError("No rental entries found.");
  }

  const enrichedRentals = await Promise.all(
    result.rows.map(async (rental) => {
      const isOwner = rental.role === "owner";
      const otherPartyId = isOwner ? rental.renter_id : rental.owner_id;

      // Fetch other party details
      const otherPartyQuery = `SELECT user_id, name, email, city, state, profile_pic FROM users WHERE user_id = $1`;
      const otherPartyResult = await pool.query(otherPartyQuery, [
        otherPartyId,
      ]);
      const otherParty = otherPartyResult.rows[0];

      // Fetch product details
      const productQuery = `SELECT product_id, product_name, unit FROM products WHERE product_id = $1`;
      const productResult = await pool.query(productQuery, [rental.product_id]);
      const product = productResult.rows[0];

      // Append other party and product details to the transaction
      return {
        ...rental,
        otherParty,
        product,
      };
    })
  );

  return res.status(StatusCodes.OK).json(enrichedRentals);
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

  const rental = result.rows[0];

  const role = rental.owner_id === req.user ? "owner" : "renter";

  // Fetch other party details
  const otherPartyId = role === "owner" ? rental.renter_id : rental.owner_id;
  const otherPartyQuery = `SELECT user_id, name, email, city, state FROM users WHERE user_id = $1`;
  const otherPartyResult = await pool.query(otherPartyQuery, [otherPartyId]);
  const otherParty = otherPartyResult.rows[0];

  const enrichedRental = {
    ...rental,
    role,
    otherParty,
  };

  return res
    .status(StatusCodes.OK)
    .json({ message: "Rental entry fetched.", rental: enrichedRental });
};

module.exports = { updateRentalStatus, getRentals, getRental };
