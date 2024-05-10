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
const model_user_1 = __importDefault(require("../models/model_user"));
const sequelize_1 = require("sequelize");
const userRouter = express_1.default.Router();
//ユーザーリストの送信
userRouter.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idList = req.query.idList;
        const result = yield model_user_1.default.findAll({
            where: {
                Uid: {
                    [sequelize_1.Op.in]: idList,
                },
            },
        });
        console.log("here");
        console.log(result);
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
userRouter.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.query.uid;
    const result = yield model_user_1.default.findOne({
        where: {
            Uid: uid,
        },
    });
    console.log(result);
    res.json(result);
}));
userRouter.put("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.body.uid;
        const userName = req.body.userName;
        const profileId = req.body.profileId;
        const msg = req.body.msg;
        const result = yield model_user_1.default.findByPk(uid);
        if (result) {
            result.UserName = userName;
            result.ProfileId = profileId;
            result.ProfileMsg = msg;
        }
        yield (result === null || result === void 0 ? void 0 : result.save());
        console.log("executed!!!");
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = userRouter;
