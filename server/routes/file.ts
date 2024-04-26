import express, { Request, Response } from "express";
import fs, { promises as fsPromises } from "fs";
import path from "path";
import sharp from "sharp";
//import jimp from "jimp";

const fileRouter = express.Router();

const app = express();

app.use(express.json());

const saveFile = async (file: Buffer, path: string): Promise<void> => {
  try {
    await fsPromises.writeFile(path, file);
  } catch (error) {
    console.log(error);
  }
};

const convertToJPEG = async (buffer: Buffer): Promise<Buffer> => {
  //const image = await jimp.read(buffer);
  //const result = await image.quality(100).getBufferAsync(jimp.MIME_JPEG);
  const result = await sharp(buffer).toFormat("jpeg").toBuffer();
  return result;
};

fileRouter.post("/send", async (req: Request, res: Response) => {
  if (req.body?.img) {
    try {
      const img = req.body?.img;
      const imgName = req.body.name;
      const base64Data = await img.split(",")[1];
      const decodedImg = await Buffer.from(base64Data, "base64");
      const jpegFile = await convertToJPEG(decodedImg);
      const imgPath = path.join(__dirname, "../upload_images/", imgName);
      await saveFile(jpegFile, imgPath);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("none");
  }
  res.json(null);
});

fileRouter.get("/get", async (req: Request, res: Response) => {
  const imgName = req.query.imgName as string;
  const imgPath = path.join(__dirname, "../upload_images/", imgName);
  if (fs.existsSync(imgPath)) {
    console.log(imgPath);
    const base64Data = fs.readFileSync(imgPath, { encoding: "base64" });
    res.json(base64Data);
  } else {
    res.status(404).send("File not found");
  }
});

module.exports = fileRouter;
