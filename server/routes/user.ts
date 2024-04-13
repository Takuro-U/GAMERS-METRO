import express, { Request, Response } from "express";
import User from "../models/model_user";
import { Op } from "sequelize";
const userRouter = express.Router();

//ユーザーリストの送信
userRouter.get("/list", async (req: Request, res: Response) => {
  try {
    const idList = req.query.idList as string[];
    const result = await User.findAll({
      where: {
        Uid: {
          [Op.in]: idList,
        },
      },
    });
    console.log("here");
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/get", async (req: Request, res: Response) => {
  const uid = req.query.uid as string;
  const result = await User.findOne({
    where: {
      Uid: uid,
    },
  });
  console.log(result);
  res.json(result);
});

userRouter.put("/update", async (req: Request, res: Response) => {
  try {
    const uid = req.body.uid as string;
    const userName = req.body.userName as string;
    const profileId = req.body.profileId as string;
    const msg = req.body.msg as string;
    const result = await User.findByPk(uid);

    if (result) {
      result.UserName = userName;
      result.ProfileId = profileId;
      result.ProfileMsg = msg;
    }
    await result?.save();

    console.log("executed!!!");

    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

module.exports = userRouter;
