"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const Community = models_1.default.define("Community", {
    Id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    Uid: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: false,
    },
    Text: {
        type: sequelize_1.DataTypes.STRING(140),
        allowNull: false,
    },
    Img1: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    Img2: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    Img3: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    Img4: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    Timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    TimestampEdit: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "community",
    timestamps: false,
});
exports.default = Community;
