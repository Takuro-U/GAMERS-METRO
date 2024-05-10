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
const model_comment_1 = __importDefault(require("../models/model_comment"));
const uuid_1 = require("uuid");
const commentRouter = express_1.default.Router();
commentRouter.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const result = yield model_comment_1.default.findAll({
            where: {
                ParentId: id,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
commentRouter.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const parentId = req.body.parentId;
        const uid = req.body.uid;
        const text = req.body.text;
        const timestamp = new Date();
        yield model_comment_1.default.create({
            Id: id,
            ParentId: parentId,
            Uid: uid,
            Text: text,
            Timestamp: timestamp,
            TimestampEdit: null,
        });
        res.json(null);
    }
    catch (error) {
        console.log(error);
    }
}));
commentRouter.put("/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const text = req.body.text;
        const timestamp = new Date();
        const result = yield model_comment_1.default.findByPk(id);
        if (result) {
            result.Text = text;
            result.TimestampEdit = timestamp;
        }
        yield (result === null || result === void 0 ? void 0 : result.save());
        res.json(null);
    }
    catch (error) { }
}));
commentRouter.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        yield model_comment_1.default.destroy({
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
module.exports = commentRouter;
