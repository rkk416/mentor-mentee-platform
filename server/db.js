const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { Pool } = require("pg");

const missingEnv = [
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
].filter((key) => !process.env[key]);

if (!process.env.DATABASE_URL && missingEnv.length) {
  throw new Error(`Missing environment variables: ${missingEnv.join(", ")}`);
}

const poolConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: String(process.env.DB_USER),
      host: String(process.env.DB_HOST),
      database: String(process.env.DB_NAME),
      password: String(process.env.DB_PASSWORD),
      port: Number(process.env.DB_PORT),
    };

const pool = new Pool(poolConfig);

// Test connection
pool.connect()
  .then(() => console.log("PostgreSQL Connected "))
  .catch(err => console.error("DB Connection Error ", err));

module.exports = pool;