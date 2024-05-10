"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const Auth = models_1.default.define("Auth", {
    Uid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    ProfileId: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    Email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    PasswordHashed: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: "auth",
    timestamps: false,
});
exports.default = Auth;
