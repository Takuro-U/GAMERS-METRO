import express, { Request, Response } from "express";
import Auth from "../models/model_auth";
import User from "../models/model_user";
import Otp from "../models/model_otp";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import mailgun from "mailgun-js";
import { Op } from "sequelize";

const authRouter = express.Router();

const crypto = require("crypto");

const mg = mailgun({
  apiKey: "7e91a97611684fa91885b6f3f6763375-8c8e5529-5175ccc0",
  domain: "sandbox464e91902d9a472e84be5f90dfd8644f.mailgun.org",
});

const transporter = nodemailer.createTransport({
  host: "mail1005.onamae.ne.jp",
  port: 465,
  secure: true,
  auth: {
    user: "main@gamers-metro.com",
    pass: "cmS4ZZe_Pb6WYBzN",
  },
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const uid = uuidv4();
    const profileId = req.body.profileId;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPass = await bcrypt.hash(password, 10);
    console.log(hashedPass);
    await Auth.create({
      Uid: uid,
      ProfileId: profileId,
      Email: email,
      PasswordHashed: hashedPass,
    });
    //以下ユーザーデータ作成
    const userData = await User.create({
      Uid: uid,
      UserName: "NoName",
      ProfileId: profileId,
      ProfileMsg: "",
      PhotoUrl: "",
      Follower: 0,
      Followee: 0,
    });
    res.json(userData);
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const emailOrProfileId = req.query.emailOrProfileId as string;
    console.log(emailOrProfileId);
    const result = await Auth.findOne({
      where: {
        [Op.or]: [{ ProfileId: emailOrProfileId }, { Email: emailOrProfileId }],
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/login/id", async (req: Request, res: Response) => {
  try {
    const id = req.query.profileId as string;
    const password = req.query.password as string;
    const hashedPass = await bcrypt.hash(password, 10);

    const result = await Auth.findOne({
      where: {
        ProfileId: id,
      },
    });
    const errorMessage = "IDまたはパスワードが違います";
    if (result) {
      const correctPass = result.PasswordHashed as string;
      if (correctPass == hashedPass) {
        //以下ログイン処理
        const uid = result.Uid;
        const userData = await User.findOne({
          where: {
            Uid: uid,
          },
        });
        res.json(userData);
      } else {
        console.log("パスワードが違います");
        res.json(errorMessage);
      }
    } else {
      console.log("ユーザーが見つかりません");
      res.json(errorMessage);
    }
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/login/email", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    const password = req.query.password as string;
    const result = await Auth.findOne({
      where: {
        Email: email,
      },
    });
    const errorMessage = "Eメールまたはパスワードが違います";
    if (result) {
      const correctPass = result.PasswordHashed.toString();
      const match = await bcrypt.compare(password, correctPass);
      if (match) {
        //以下ログイン処理
        const uid = result.Uid;
        const userData = await User.findOne({
          where: {
            Uid: uid,
          },
        });
        res.json(userData);
      } else {
        console.log("パスワードが違います");
        res.json(errorMessage);
      }
    } else {
      console.log("ユーザーが見つかりません");
      res.json(errorMessage);
    }
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/idlist", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const result = await Auth.findOne({
      attributes: ["profileId"],
      where: {
        ProfileId: id,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

authRouter.post("/email", async (req: Request, res: Response) => {
  try {
    const address = req.body.address;
    const oneTimePass = crypto.randomInt(100000, 1000000).toString();
    const mailOptions = {
      from: "main@gamers-metro.com",
      to: address,
      subject: "GAMERS' METRO ワンタイムパスワード",
      text: oneTimePass,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error occurred:", error);
      } else {
        console.log("Email sent:", info.response);
      }
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        const id = uuidv4();

        await Otp.create({
          Id: id,
          Email: address,
          ProfileId: "",
          OneTimePass: oneTimePass,
        });
        res.json(null);
      }
    });
  } catch (error) {}
});

//メール送信テスト
authRouter.post("/email-test", async (req: Request, res: Response) => {
  try {
    const address = req.body.address;
    const oneTimePass = crypto.randomInt(100000, 1000000);
    const mailData: mailgun.messages.SendData = {
      from: "422314@m.mie-u.ac.jp",
      to: address,
      subject: "GAMERS' METRO ワンタイムパスワード",
      text: oneTimePass,
    };
    mg.messages().send(mailData, async (error, body) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log(body);
        const id = uuidv4();

        await Otp.create({
          Id: id,
          Email: address,
          ProfileId: "",
          OneTimePass: oneTimePass,
        });
        res.json(null);
      }
    });

    console.log("executed!!");
    console.log(address);
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/otpcheck", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    const oneTimePass = req.query.otp as string;
    const result = await Otp.findOne({
      attributes: ["Id"],
      where: {
        Email: email,
        OneTimePass: oneTimePass,
      },
    });
    if (result?.Id) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error);
  }
});

authRouter.delete("/otp-reset", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    console.log("でりーと");
    console.log(email);
    await Otp.destroy({
      where: {
        Email: email,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

authRouter.put("/reset-pass", async (req: Request, res: Response) => {
  const uid = req.body.uid as string;
  const currentPass = req.body.currentPass as string;
  const newPass = req.body.newPass as string;
  const result = await Auth.findByPk(uid);
  if (result) {
    const correctPass = result?.PasswordHashed.toString();
    const match = await bcrypt.compare(currentPass, correctPass);
    if (match) {
      const hushedPass = await bcrypt.hash(newPass, 10);
      result.PasswordHashed = hushedPass;
      await result.save();
      res.json(true);
      console.log("executed");
    } else {
      res.json(false);
      console.log(match);
    }
  }
});

module.exports = authRouter;
