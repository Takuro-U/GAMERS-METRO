"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const Otp = models_1.default.define("Otp", {
    Id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    Email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    ProfileId: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    OneTimePass: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: "otp",
    timestamps: false,
});
exports.default = Otp;
