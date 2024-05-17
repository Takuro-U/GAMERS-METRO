import express from "express";
import cors from "cors";
import sequelize from "../models";

const app = express();

const dmRouter = require("../routes/dm");
const authRouter = require("../routes/auth");
const fileRouter = require("../routes/file");
const postRouter = require("../routes/post");
const userRouter = require("../routes/user");
const followRouter = require("../routes/follow");
const commentRouter = require("../routes/comment");

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ["https://gamers-metro.com:5000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

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
