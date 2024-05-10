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
const model_follow_1 = __importDefault(require("../models/model_follow"));
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const followRouter = express_1.default.Router();
followRouter.get("/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUid = req.query.myUid;
        const othersUid = req.query.othersUid;
        const following = yield model_follow_1.default.findOne({
            attributes: ["id"],
            where: {
                Follower: myUid,
                Followee: othersUid,
            },
        });
        const followed = yield model_follow_1.default.findOne({
            attributes: ["id"],
            where: {
                Follower: othersUid,
                Followee: myUid,
            },
        });
        const result = { following, followed };
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
followRouter.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.query.uid;
        const followersId = yield model_follow_1.default.findAll({
            attributes: ["Follower"],
            where: {
                Followee: uid,
            },
        });
        const followersIdArray = followersId.map((follower) => follower.Follower);
        const followeesId = yield model_follow_1.default.findAll({
            attributes: ["Followee"],
            where: {
                Follower: uid,
            },
        });
        const followeesIdArray = followeesId.map((followee) => followee.Followee);
        const followers = yield model_user_1.default.findAll({
            where: {
                Uid: {
                    [sequelize_1.Op.in]: followersIdArray,
                },
            },
        });
        const followees = yield model_user_1.default.findAll({
            where: {
                Uid: {
                    [sequelize_1.Op.in]: followeesIdArray,
                },
            },
        });
        const result = { followers, followees };
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
followRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const follower = req.body.follower;
        const followee = req.body.followee;
        console.log(follower);
        console.log(followee);
        yield model_follow_1.default.create({
            Id: id,
            Follower: follower,
            Followee: followee,
        });
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
followRouter.delete("/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const follower = req.query.follower;
        const followee = req.query.followee;
        yield model_follow_1.default.destroy({
            where: {
                Follower: follower,
                Followee: followee,
            },
        });
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = followRouter;
