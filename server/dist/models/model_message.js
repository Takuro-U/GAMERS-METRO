"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const Message = models_1.default.define("Message", {
    Id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    Message: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    ActiveUid: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    PassiveUid: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    RoomId: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    Timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
}, {
    tableName: "messages",
    timestamps: false,
});
exports.default = Message;
