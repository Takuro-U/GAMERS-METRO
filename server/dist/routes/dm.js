"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_message_1 = __importDefault(require("../models/model_message"));
const model_room_1 = __importDefault(require("../models/model_room"));
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const dmRouter = express_1.default.Router();
dmRouter.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const message = req.body.message;
        const activeUid = req.body.activeUid;
        const passiveUid = req.body.passiveUid;
        const roomId = req.body.roomId;
        const timestamp = new Date();
        yield model_message_1.default.create({
            Id: id,
            Message: message,
            ActiveUid: activeUid,
            PassiveUid: passiveUid,
            RoomId: roomId,
            Timestamp: timestamp,
        });
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
dmRouter.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uids = req.query.uids;
        const result = yield model_message_1.default.findAll({
            where: {
                ActiveUid: {
                    [sequelize_1.Op.in]: uids,
                },
                PassiveUid: {
                    [sequelize_1.Op.in]: uids,
                },
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
dmRouter.get("/last", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.query.uid;
        const roomIdList = (yield model_room_1.default.findAll({
            attributes: ["Id"],
            where: {
                [sequelize_1.Op.or]: [{ Uid1: uid }, { Uid2: uid }],
            },
        }));
        const lastMessages = [];
        for (const roomId of roomIdList) {
            const lastMessage = yield model_message_1.default.findOne({
                where: {
                    RoomId: roomId.Id,
                },
                order: [["timestamp", "DESC"]],
            });
            console.log(lastMessage);
            if (lastMessage) {
                lastMessages.push(lastMessage);
            }
        }
        res.json(lastMessages);
    }
    catch (error) {
        console.log(error);
    }
}));
dmRouter.get("/room/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid1 = req.query.uid1;
        const uid2 = req.query.uid2;
        const result = yield model_room_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { [sequelize_1.Op.and]: [{ Uid1: uid1 }, { Uid2: uid2 }] },
                    { [sequelize_1.Op.and]: [{ Uid1: uid2 }, { Uid2: uid1 }] },
                ],
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
dmRouter.post("/room/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const uid1 = req.body.uid1;
        const uid2 = req.body.uid2;
        const result = yield model_room_1.default.create({
            Id: id,
            Uid1: uid1,
            Uid2: uid2,
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = dmRouter;
