import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: envPath });

const sequelize = new Sequelize(
  process.env.DB_NAME || "default_db_name",
  process.env.DB_USER || "default_db_name",
  process.env.DB_PASS || "default_db_pass",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  }
);

export default sequelize;
