import express, { Request, Response } from "express";
import Comment from "../models/model_comment";
import { v4 as uuidv4 } from "uuid";

const commentRouter = express.Router();

commentRouter.get("/get", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const result = await Comment.findAll({
      where: {
        ParentId: id,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

commentRouter.post("/send", async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const parentId = req.body.parentId as string;
    const uid = req.body.uid as string;
    const text = req.body.text as string;
    const timestamp = new Date();
    await Comment.create({
      Id: id,
      ParentId: parentId,
      Uid: uid,
      Text: text,
      Timestamp: timestamp,
      TimestampEdit: null,
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

commentRouter.put("/edit", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const text = req.body.text;
    const timestamp = new Date();
    const result = await Comment.findByPk(id);

    if (result) {
      result.Text = text;
      result.TimestampEdit = timestamp;
    }
    await result?.save();

    res.json(null);
  } catch (error) {}
});

commentRouter.delete("/delete", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    await Comment.destroy({
      where: {
        Id: id,
      },
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

module.exports = commentRouter;
