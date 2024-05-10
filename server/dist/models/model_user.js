"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const User = models_1.default.define("User", {
    Uid: {
        type: sequelize_1.DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
    },
    UserName: {
        type: sequelize_1.DataTypes.STRING(16),
        allowNull: false,
    },
    ProfileId: {
        type: sequelize_1.DataTypes.STRING(16),
        allowNull: false,
    },
    ProfileMsg: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    PhotoUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    Follower: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    Followee: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
}, {
    tableName: "users",
    timestamps: false,
});
exports.default = User;
