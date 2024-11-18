const Pool = require("pg").Pool;

// DEV MODE
// const pool = new Pool({
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DATABASE_PORT,
//   database: process.env.DATABASE_NAME,
// });

// PRODUCTION MODE
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Render's managed PostgreSQL
  },
});

module.exports = pool;
