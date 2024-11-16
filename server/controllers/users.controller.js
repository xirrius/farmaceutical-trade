const bcrypt = require("bcrypt");
const fs = require("fs");
const pool = require("../database/db");
const generate = require("../utils/generate");
const { StatusCodes } = require("http-status-codes");
const {
  UnauthorizedError,
  BadRequestError,
  ServerError,
  NotFoundError,
} = require("../errors");
const sendEmail = require("../utils/mail");
const uploadOnCloudinary = require("../utils/cloudinary");

const register = async (req, res) => {
  const {
    email,
    name,
    password,
    state,
    city,
    address,
    contact_info,
    profile_pic,
  } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user.rows.length > 0) {
    throw new UnauthorizedError("Invalid Credentials.");
  }

  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  let newUser = await pool.query(
    "INSERT INTO users (name, email, password, state, city, address, contact_info, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      name,
      email,
      bcryptPassword,
      state,
      city,
      address,
      contact_info,
      profile_pic,
    ]
  );
  const token = generate(newUser.rows[0].user_id);
  sendEmail(email, name);
  delete newUser.rows[0].password
  return res.status(StatusCodes.CREATED).json({
    user: newUser.rows[0],
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    throw new UnauthorizedError("Invalid Credentials.");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  if (!validPassword) {
    throw new UnauthorizedError("Invalid Credentials.");
  }
  const token = generate(user.rows[0].user_id);
  delete user.rows[0].password
  return res.status(StatusCodes.OK).json({
    user:user.rows[0],
    token,
  });
};

const getProfile = async (req, res) => {
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    req.user,
  ]);
  const { password, ...userWithoutPassword } = user.rows[0];
  return res.status(StatusCodes.OK).json(userWithoutPassword);
};

const getOtherProfile = async (req, res) => {
  const {id} = req.params
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    id,
  ]);
  if(!user) {
    throw new NotFoundError("User noy found.")
  }
  const { password, ...userWithoutPassword } = user.rows[0];
  return res.status(StatusCodes.OK).json(userWithoutPassword);
};

const updateProfile = async (req, res) => {
  const { email, name, state, city, address, contact_info } = req.body;
  if (!email || !name || !state || !city || !address || !contact_info) {
    throw new BadRequestError("Please provide the necessary details.");
  }
  console.log(req.file);
  
  let fileUrl = null;

  if (req.file) {
    
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
  }

  // Construct base query and parameters array
  let query = `UPDATE users SET email = $1, name = $2, state = $3, city = $4, address = $5, contact_info = $6`;
  const values = [email, name, state, city, address, contact_info];

  // Conditionally add `profile_pic` if `fileUrl` exists
  if (fileUrl) {
    query += `, profile_pic = $7`;
    values.push(fileUrl);
  }

  // Add the `WHERE` clause to target specific user
  query += ` WHERE user_id = $${values.length + 1} RETURNING *`;
  values.push(req.user);

  const user = await pool.query(query, values);
  const {password, ...userWithoutPassword} = user.rows[0]
  res.status(StatusCodes.OK).json({ message: "Profile updated successfully.", user:userWithoutPassword });
};


module.exports = { register, login, getProfile, updateProfile, getOtherProfile };
