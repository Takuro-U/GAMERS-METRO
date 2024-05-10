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
const model_post_1 = __importDefault(require("../models/model_post"));
const model_community_1 = __importDefault(require("../models/model_community"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const postRouter = express_1.default.Router();
//投稿の追加
postRouter.post("/board/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = (0, uuid_1.v4)();
        const uid = req.body.uid;
        const gameTitle = req.body.gameTitle;
        const postTitle = req.body.postTitle;
        const member = req.body.numOfmember;
        const postMsg = req.body.postMsg;
        const timestamp = new Date();
        const newPost = yield model_post_1.default.create({
            Id: postId,
            Uid: uid,
            GameTitle: gameTitle,
            PostTitle: postTitle,
            Member: member,
            PostMsg: postMsg,
            Timestamp: timestamp,
            TimestampEdit: null,
        });
        res.json(newPost);
    }
    catch (error) {
        console.error("Error creating post", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
postRouter.get("/board/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_post_1.default.findAll();
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.get("/board/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyWords = req.query.keyWords;
        const result = yield model_post_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        GameTitle: {
                            [sequelize_1.Op.or]: keyWords.map((keyWord) => ({
                                [sequelize_1.Op.substring]: keyWord,
                            })),
                        },
                    },
                    {
                        PostTitle: {
                            [sequelize_1.Op.or]: keyWords.map((keyWord) => ({
                                [sequelize_1.Op.substring]: keyWord,
                            })),
                        },
                    },
                    {
                        PostTitle: {
                            [sequelize_1.Op.or]: keyWords.map((keyWord) => ({
                                [sequelize_1.Op.substring]: keyWord,
                            })),
                        },
                    },
                    {
                        PostMsg: {
                            [sequelize_1.Op.or]: keyWords.map((keyWord) => ({
                                [sequelize_1.Op.substring]: keyWord,
                            })),
                        },
                    },
                ],
            },
        });
        res.json(result);
    }
    catch (error) { }
}));
postRouter.get("/board/user/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.query.uid;
        const result = yield model_post_1.default.findAll({
            where: {
                Uid: uid,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.put("/board/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const gameTitle = req.body.gameTitle;
        const postTitle = req.body.postTitle;
        const postMsg = req.body.postMsg;
        const timestamp = new Date();
        const result = yield model_post_1.default.findByPk(id);
        if (result) {
            result.GameTitle = gameTitle;
            result.PostTitle = postTitle;
            result.PostMsg = postMsg;
            result.TimestampEdit = timestamp;
        }
        yield (result === null || result === void 0 ? void 0 : result.save());
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.delete("/board/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        yield model_post_1.default.destroy({
            where: {
                Id: id,
            },
        });
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.post("/community/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = (0, uuid_1.v4)();
        const uid = req.body.uid;
        const text = req.body.text;
        const img1 = req.body.img1;
        const img2 = req.body.img2;
        const img3 = req.body.img3;
        const img4 = req.body.img4;
        const timestamp = new Date();
        const newPost = yield model_community_1.default.create({
            Id: postId,
            Uid: uid,
            Text: text,
            Img1: img1,
            Img2: img2,
            Img3: img3,
            Img4: img4,
            Timestamp: timestamp,
            TimestampEdit: null,
        });
        res.json(newPost);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.get("/community/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_community_1.default.findAll();
        console.log(result);
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.get("/community/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyWords = req.query.keyWords;
        const result = yield model_community_1.default.findAll({
            where: {
                Text: {
                    [sequelize_1.Op.or]: keyWords.map((keyWord) => ({
                        [sequelize_1.Op.substring]: keyWord,
                    })),
                },
            },
        });
        res.json(result);
    }
    catch (error) { }
}));
postRouter.get("/community/user/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.query.uid;
        const result = yield model_community_1.default.findAll({
            where: {
                Uid: uid,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
postRouter.put("/community/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const text = req.body.text;
        const timestamp = new Date();
        const result = yield model_community_1.default.findByPk(id);
        if (result) {
            result.Text = text;
            result.TimestampEdit = timestamp;
        }
        yield (result === null || result === void 0 ? void 0 : result.save());
        res.json(null);
    }
    catch (error) { }
}));
postRouter.delete("/community/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        yield model_community_1.default.destroy({
            where: {
                Id: id,
            },
        });
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = postRouter;
