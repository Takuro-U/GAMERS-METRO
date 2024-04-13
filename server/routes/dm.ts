import express, { Request, Response } from "express";
import Message from "../models/model_message";
import Room from "../models/model_room";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

const dmRouter = express.Router();

type IdList = {
  Id: string;
};

dmRouter.post("/send", async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const message = req.body.message as string;
    const activeUid = req.body.activeUid as string;
    const passiveUid = req.body.passiveUid as string;
    const roomId = req.body.roomId as string;
    const timestamp = new Date();
    await Message.create({
      Id: id,
      Message: message,
      ActiveUid: activeUid,
      PassiveUid: passiveUid,
      RoomId: roomId,
      Timestamp: timestamp,
    });
    res.json(null);
  } catch (error) {
    console.log(error);
  }
});

dmRouter.get("/get", async (req: Request, res: Response) => {
  try {
    const uids = req.query.uids as [];
    const result = await Message.findAll({
      where: {
        ActiveUid: {
          [Op.in]: uids,
        },
        PassiveUid: {
          [Op.in]: uids,
        },
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

dmRouter.get("/last", async (req: Request, res: Response) => {
  try {
    const uid = req.query.uid as string;
    const roomIdList = (await Room.findAll({
      attributes: ["Id"],
      where: {
        [Op.or]: [{ Uid1: uid }, { Uid2: uid }],
      },
    })) as IdList[];
    const lastMessages: any[] = [];
    for (const roomId of roomIdList) {
      const lastMessage = await Message.findOne({
        where: {
          RoomId: roomId.Id,
        },
        order: [["timestamp", "DESC"]],
      });
      console.log(lastMessage);
      if (lastMessage) {
        lastMessages.push(lastMessage);
      }
    }
    res.json(lastMessages);
  } catch (error) {
    console.log(error);
  }
});

dmRouter.get("/room/check", async (req: Request, res: Response) => {
  try {
    const uid1 = req.query.uid1 as string;
    const uid2 = req.query.uid2 as string;
    const result = await Room.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ Uid1: uid1 }, { Uid2: uid2 }] },
          { [Op.and]: [{ Uid1: uid2 }, { Uid2: uid1 }] },
        ],
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

dmRouter.post("/room/create", async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const uid1 = req.body.uid1 as string;
    const uid2 = req.body.uid2 as string;
    const result = await Room.create({
      Id: id,
      Uid1: uid1,
      Uid2: uid2,
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = dmRouter;
