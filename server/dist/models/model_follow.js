"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const Follow = models_1.default.define("Follow", {
    Id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    Follower: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    Followee: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
}, {
    tableName: "follow",
    timestamps: false,
});
exports.default = Follow;
