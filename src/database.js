const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "admin",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "rinha",
  password: process.env.DB_PASS || "123",
  port: process.env.DB_PORT || 5432,
  max: process.env.DB_POOL_SIZE || 10,
});

module.exports = { pool };
