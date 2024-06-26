"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, "..", ".env");
dotenv_1.default.config({ path: envPath });
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || "default_db_name", process.env.DB_USER || "default_db_name", process.env.DB_PASS || "default_db_pass", {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
});
exports.default = sequelize;
