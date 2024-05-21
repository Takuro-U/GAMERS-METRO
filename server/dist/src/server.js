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
const cors_1 = __importDefault(require("cors"));
const models_1 = __importDefault(require("../models"));
const app = (0, express_1.default)();
const dmRouter = require("../routes/dm");
const authRouter = require("../routes/auth");
const fileRouter = require("../routes/file");
const postRouter = require("../routes/post");
const userRouter = require("../routes/user");
const followRouter = require("../routes/follow");
const commentRouter = require("../routes/comment");
const PORT = process.env.PORT || 80;
const corsOptions = {
    origin: ["https://gamers-metro.com", "http://localhost:3000"],
    optionsSuccessStatus: 200,
};
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.use("/dm", dmRouter);
app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/follow", followRouter);
app.use("/comment", commentRouter);
app.get("/api/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json("executed");
}));
app.listen(PORT, () => {
    console.log("サーバーがポート" + PORT + "で実行中です");
});
models_1.default
    .authenticate()
    .then(() => {
    console.log("Connection has been established successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
