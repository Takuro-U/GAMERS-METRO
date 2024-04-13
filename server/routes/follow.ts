import express, { Request, Response } from "express";
import User from "../models/model_user";
import Follow from "../models/model_follow";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

const followRouter = express.Router();

followRouter.get("/check", async (req: Request, res: Response) => {
  try {
    const myUid = req.query.myUid as string;
    const othersUid = req.query.othersUid as string;
    const following = await Follow.findOne({
      attributes: ["id"],
      where: {
        Follower: myUid,
        Followee: othersUid,
      },
    });
    const followed = await Follow.findOne({
      attributes: ["id"],
      where: {
        Follower: othersUid,
        Followee: myUid,
      },
    });
    const result = { following, followed };
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

followRouter.get("/list", async (req: Request, res: Response) => {
  try {
    const uid = req.query.uid as string;
    const followersId = await Follow.findAll({
      attributes: ["Follower"],
      where: {
        Followee: uid,
      },
    });
    const followersIdArray = followersId.map((follower) => follower.Follower);
    const followeesId = await Follow.findAll({
      attributes: ["Followee"],
      where: {
        Follower: uid,
      },
    });
    const followeesIdArray = followeesId.map((followee) => followee.Followee);
    const followers = await User.findAll({
      where: {
        Uid: {
          [Op.in]: followersIdArray,
        },
      },
    });
    const followees = await User.findAll({
      where: {
        Uid: {
          [Op.in]: followeesIdArray,
        },
      },
    });
    const result = { followers, followees };
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

followRouter.post("/add", async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const follower = req.body.follower as string;
    const followee = req.body.followee as string;
    console.log(follower);
    console.log(followee);
    await Follow.create({
      Id: id,
      Follower: follower,
      Followee: followee,
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

followRouter.delete("/remove", async (req: Request, res: Response) => {
  try {
    const follower = req.query.follower as string;
    const followee = req.query.followee as string;
    await Follow.destroy({
      where: {
        Follower: follower,
        Followee: followee,
      },
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

module.exports = followRouter;
