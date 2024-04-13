import express, { Request, Response } from "express";
import Post from "../models/model_post";
import Community from "../models/model_community";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const postRouter = express.Router();

//投稿の追加
postRouter.post("/board/send", async (req: Request, res: Response) => {
  try {
    const postId = uuidv4();
    const uid = req.body.uid;
    const gameTitle = req.body.gameTitle;
    const postTitle = req.body.postTitle;
    const member = req.body.numOfmember;
    const postMsg = req.body.postMsg;
    const timestamp = new Date();
    const newPost = await Post.create({
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
  } catch (error) {
    console.error("Error creating post", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

postRouter.get("/board/get", async (req: Request, res: Response) => {
  try {
    const result = await Post.findAll();
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

postRouter.get("/board/search", async (req: Request, res: Response) => {
  try {
    const keyWords = req.query.keyWords as string[];
    const result = await Post.findAll({
      where: {
        [Op.or]: [
          {
            GameTitle: {
              [Op.or]: keyWords.map((keyWord) => ({
                [Op.substring]: keyWord,
              })),
            },
          },
          {
            PostTitle: {
              [Op.or]: keyWords.map((keyWord) => ({
                [Op.substring]: keyWord,
              })),
            },
          },
          {
            PostTitle: {
              [Op.or]: keyWords.map((keyWord) => ({
                [Op.substring]: keyWord,
              })),
            },
          },
          {
            PostMsg: {
              [Op.or]: keyWords.map((keyWord) => ({
                [Op.substring]: keyWord,
              })),
            },
          },
        ],
      },
    });
    res.json(result);
  } catch (error) {}
});

postRouter.get("/board/user/get", async (req: Request, res: Response) => {
  try {
    const uid = req.query.uid as string;
    const result = await Post.findAll({
      where: {
        Uid: uid,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

postRouter.put("/board/edit", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const gameTitle = req.body.gameTitle;
    const postTitle = req.body.postTitle;
    const postMsg = req.body.postMsg;
    const timestamp = new Date();
    const result = await Post.findByPk(id);

    if (result) {
      result.GameTitle = gameTitle;
      result.PostTitle = postTitle;
      result.PostMsg = postMsg;
      result.TimestampEdit = timestamp;
    }
    await result?.save();

    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

postRouter.delete("/board/delete", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    await Post.destroy({
      where: {
        Id: id,
      },
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

postRouter.post("/community/send", async (req: Request, res: Response) => {
  try {
    const postId = uuidv4();
    const uid = req.body.uid;
    const text = req.body.text;
    const img1 = req.body.img1;
    const img2 = req.body.img2;
    const img3 = req.body.img3;
    const img4 = req.body.img4;
    const timestamp = new Date();
    const newPost = await Community.create({
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
  } catch (error) {
    console.log(error);
  }
});

postRouter.get("/community/get", async (req: Request, res: Response) => {
  try {
    const result = await Community.findAll();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

postRouter.get("/community/search", async (req: Request, res: Response) => {
  try {
    const keyWords = req.query.keyWords as string[];
    const result = await Community.findAll({
      where: {
        Text: {
          [Op.or]: keyWords.map((keyWord) => ({
            [Op.substring]: keyWord,
          })),
        },
      },
    });
    res.json(result);
  } catch (error) {}
});

postRouter.get("/community/user/get", async (req: Request, res: Response) => {
  try {
    const uid = req.query.uid as string;
    const result = await Community.findAll({
      where: {
        Uid: uid,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

postRouter.put("/community/edit", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const text = req.body.text;
    const timestamp = new Date();
    const result = await Community.findByPk(id);

    if (result) {
      result.Text = text;
      result.TimestampEdit = timestamp;
    }
    await result?.save();

    res.json(null);
  } catch (error) {}
});

postRouter.delete("/community/delete", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    await Community.destroy({
      where: {
        Id: id,
      },
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

module.exports = postRouter;
