"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const jimp_1 = __importDefault(require("jimp"));
const fileRouter = express_1.default.Router();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const saveFile = (file, path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.promises.writeFile(path, file);
    }
    catch (error) {
        console.log(error);
    }
});
const convertToJPEG = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield jimp_1.default.read(buffer);
    const result = yield image.quality(100).getBufferAsync(jimp_1.default.MIME_JPEG);
    return result;
});
fileRouter.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.img) {
        try {
            const img = (_b = req.body) === null || _b === void 0 ? void 0 : _b.img;
            const imgName = req.body.name;
            const base64Data = yield img.split(",")[1];
            const decodedImg = yield Buffer.from(base64Data, "base64");
            const jpegFile = yield convertToJPEG(decodedImg);
            const imgPath = path_1.default.join(__dirname, "../upload_images/", imgName);
            yield saveFile(jpegFile, imgPath);
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        console.log("none");
    }
    res.json(null);
}));
fileRouter.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imgName = req.query.imgName;
    const imgPath = path_1.default.join(__dirname, "../upload_images/", imgName);
    if (fs_1.default.existsSync(imgPath)) {
        console.log(imgPath);
        const base64Data = fs_1.default.readFileSync(imgPath, { encoding: "base64" });
        res.json(base64Data);
    }
    else {
        res.status(404).send("File not found");
    }
}));
module.exports = fileRouter;
