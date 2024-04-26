import React, { useState, useEffect } from "react";
import styles from "./CommunityInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type PROPS = {
  triggerSendPost: ((func: () => void) => void) | null;
  toggleInputMode: (value: boolean) => void;
};

const CommunityInput: React.FC<PROPS> = (props) => {
  const [postMsg, setPostMsg] = useState("");
  const [imgData1, setImgData1] = useState<File | null>(null);
  const [imgUrl1, setImgUrl1] = useState("");
  const [imgData2, setImgData2] = useState<File | null>(null);
  const [imgUrl2, setImgUrl2] = useState("");
  const [imgData3, setImgData3] = useState<File | null>(null);
  const [imgUrl3, setImgUrl3] = useState("");
  const [imgData4, setImgData4] = useState<File | null>(null);
  const [imgUrl4, setImgUrl4] = useState("");

  const user = useSelector(selectUser);

  //Base64エンコード
  const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  //画像アップロード
  const addImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      if (imgData4) {
        return;
      } else if (imgData3) {
        setImgData4(e.target.files![0]);
        setImgUrl4(URL.createObjectURL(e.target.files![0]));
        e.target.value = "";
      } else if (imgData2) {
        setImgData3(e.target.files![0]);
        setImgUrl3(URL.createObjectURL(e.target.files![0]));
      } else if (imgData1) {
        setImgData2(e.target.files![0]);
        setImgUrl2(URL.createObjectURL(e.target.files![0]));
      } else {
        setImgData1(e.target.files![0]);
        setImgUrl1(URL.createObjectURL(e.target.files![0]));
      }
      e.target.value = "";
    } else {
      console.log("none");
    }
  };

  //ファイル名取得
  const getFileName = async (image: File | null) => {
    if (image) {
      const timestamp = new Date().toString;
      const fileName = uuidv4() + "_" + timestamp + ".jpg";
      return fileName;
    }
    return null;
  };

  //新投稿機能
  const sendPost = async ({
    imgData1,
    imgData2,
    imgData3,
    imgData4,
  }: {
    imgData1: File | null;
    imgData2: File | null;
    imgData3: File | null;
    imgData4: File | null;
  }) => {
    if (postMsg != "" || imgData1) {
      const imgName1 = await getFileName(imgData1);
      const imgName2 = await getFileName(imgData2);
      const imgName3 = await getFileName(imgData3);
      const imgName4 = await getFileName(imgData4);
      await axios.post("http://localhost:5000/post/community/send", {
        uid: user.uid,
        text: postMsg,
        img1: imgName1,
        img2: imgName2,
        img3: imgName3,
        img4: imgName4,
      });
      if (imgData1) {
        const img = await fileToBase64(imgData1);
        const name = imgName1;
        const fileData = {
          name,
          img,
        };
        await axios.post("http://localhost:5000/file/send", fileData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (imgData2) {
        const img = await fileToBase64(imgData2);
        const name = imgName2;
        const fileData = {
          name,
          img,
        };
        await axios.post("http://localhost:5000/file/send", fileData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (imgData3) {
        const img = await fileToBase64(imgData3);
        const name = imgName3;
        const fileData = {
          name,
          img,
        };
        await axios.post("http://localhost:5000/file/send", fileData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (imgData4) {
        const img = await fileToBase64(imgData4);
        const name = imgName4;
        const fileData = {
          name,
          img,
        };
        await axios.post("http://localhost:5000/file/send", fileData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
    props.toggleInputMode(false);
  };

  useEffect(() => {
    if (props.triggerSendPost) {
      props.triggerSendPost(() =>
        sendPost({ imgData1, imgData2, imgData3, imgData4 })
      );
    }
  }, [postMsg, imgData1, imgData2, imgData3, imgData4]);

  return (
    <div>
      <div className={styles.form_area}>
        <div className={styles.form_wrapper}>
          <textarea
            placeholder="What's happening?"
            value={postMsg}
            onChange={(e) => setPostMsg(e.target.value)}
          />
        </div>
        <IconButton>
          <label>
            <form encType="multipart/form-data">
              <input type="file" onChange={addImageHandler} />
            </form>
          </label>
        </IconButton>
        {imgData1 && <img src={imgUrl1} />}
        {imgData2 && <img src={imgUrl2} />}
        {imgData3 && <img src={imgUrl3} />}
        {imgData4 && <img src={imgUrl4} />}
      </div>
    </div>
  );
};

export default CommunityInput;
