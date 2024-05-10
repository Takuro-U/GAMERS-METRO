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
const model_auth_1 = __importDefault(require("../models/model_auth"));
const model_user_1 = __importDefault(require("../models/model_user"));
const model_otp_1 = __importDefault(require("../models/model_otp"));
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sequelize_1 = require("sequelize");
const authRouter = express_1.default.Router();
const crypto = require("crypto");
const transporter = nodemailer_1.default.createTransport({
    host: "mail1005.onamae.ne.jp",
    port: 465,
    secure: true,
    auth: {
        user: "main@gamers-metro.com",
        pass: "cmS4ZZe_Pb6WYBzN",
    },
});
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = (0, uuid_1.v4)();
        const profileId = req.body.profileId;
        const email = req.body.email;
        const password = req.body.password;
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        console.log(hashedPass);
        yield model_auth_1.default.create({
            Uid: uid,
            ProfileId: profileId,
            Email: email,
            PasswordHashed: hashedPass,
        });
        //以下ユーザーデータ作成
        const userData = yield model_user_1.default.create({
            Uid: uid,
            UserName: "NoName",
            ProfileId: profileId,
            ProfileMsg: "",
            PhotoUrl: "",
            Follower: 0,
            Followee: 0,
        });
        res.json(userData);
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailOrProfileId = req.query.emailOrProfileId;
        console.log(emailOrProfileId);
        const result = yield model_auth_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ ProfileId: emailOrProfileId }, { Email: emailOrProfileId }],
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.get("/login/id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.profileId;
        const password = req.query.password;
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        const result = yield model_auth_1.default.findOne({
            where: {
                ProfileId: id,
            },
        });
        const errorMessage = "IDまたはパスワードが違います";
        if (result) {
            const correctPass = result.PasswordHashed;
            if (correctPass == hashedPass) {
                //以下ログイン処理
                const uid = result.Uid;
                const userData = yield model_user_1.default.findOne({
                    where: {
                        Uid: uid,
                    },
                });
                res.json(userData);
            }
            else {
                console.log("パスワードが違います");
                res.json(errorMessage);
            }
        }
        else {
            console.log("ユーザーが見つかりません");
            res.json(errorMessage);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.get("/login/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const password = req.query.password;
        const result = yield model_auth_1.default.findOne({
            where: {
                Email: email,
            },
        });
        const errorMessage = "Eメールまたはパスワードが違います";
        if (result) {
            const correctPass = result.PasswordHashed.toString();
            const match = yield bcryptjs_1.default.compare(password, correctPass);
            if (match) {
                //以下ログイン処理
                const uid = result.Uid;
                const userData = yield model_user_1.default.findOne({
                    where: {
                        Uid: uid,
                    },
                });
                res.json(userData);
            }
            else {
                console.log("パスワードが違います");
                res.json(errorMessage);
            }
        }
        else {
            console.log("ユーザーが見つかりません");
            res.json(errorMessage);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.get("/idlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const result = yield model_auth_1.default.findOne({
            attributes: ["profileId"],
            where: {
                ProfileId: id,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.post("/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = req.body.address;
        const oneTimePass = crypto.randomInt(100000, 1000000).toString();
        const mailOptions = {
            from: "main@gamers-metro.com",
            to: address,
            subject: "GAMERS' METRO ワンタイムパスワード",
            text: oneTimePass,
        };
        transporter.sendMail(mailOptions, (error, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error("Error occurred:", error);
            }
            else {
                console.log("Email sent:", info.response);
            }
            if (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to send email" });
            }
            else {
                const id = (0, uuid_1.v4)();
                yield model_otp_1.default.create({
                    Id: id,
                    Email: address,
                    ProfileId: "",
                    OneTimePass: oneTimePass,
                });
                res.json(null);
            }
        }));
    }
    catch (error) { }
}));
authRouter.get("/otpcheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const oneTimePass = req.query.otp;
        const result = yield model_otp_1.default.findOne({
            attributes: ["Id"],
            where: {
                Email: email,
                OneTimePass: oneTimePass,
            },
        });
        if (result === null || result === void 0 ? void 0 : result.Id) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.delete("/otp-reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        console.log("でりーと");
        console.log(email);
        yield model_otp_1.default.destroy({
            where: {
                Email: email,
            },
        });
    }
    catch (error) {
        console.log(error);
    }
}));
authRouter.put("/reset-pass", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.body.uid;
    const currentPass = req.body.currentPass;
    const newPass = req.body.newPass;
    const result = yield model_auth_1.default.findByPk(uid);
    if (result) {
        const correctPass = result === null || result === void 0 ? void 0 : result.PasswordHashed.toString();
        const match = yield bcryptjs_1.default.compare(currentPass, correctPass);
        if (match) {
            const hushedPass = yield bcryptjs_1.default.hash(newPass, 10);
            result.PasswordHashed = hushedPass;
            yield result.save();
            res.json(true);
            console.log("executed");
        }
        else {
            res.json(false);
            console.log(match);
        }
    }
}));
module.exports = authRouter;
