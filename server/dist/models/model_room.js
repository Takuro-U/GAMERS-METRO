"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const Room = models_1.default.define("Room", {
    Id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    Uid1: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    Uid2: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
}, {
    tableName: "rooms",
    timestamps: false,
});
exports.default = Room;
