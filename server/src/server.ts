import express from "express";
import cors from "cors";
import sequelize from "../models";
import fileUpload from "express-fileupload";

const app = express();

const bodyParser = require("body-parser");

const dmRouter = require("../routes/dm");
const authRouter = require("../routes/auth");
const fileRouter = require("../routes/file");
const postRouter = require("../routes/post");
const userRouter = require("../routes/user");
const followRouter = require("../routes/follow");
const commentRouter = require("../routes/comment");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.use(cors());

app.use("/dm", dmRouter);
app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/follow", followRouter);
app.use("/comment", commentRouter);

app.listen(PORT, () => {
  console.log("サーバーがポート" + PORT + "で実行中です");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });
