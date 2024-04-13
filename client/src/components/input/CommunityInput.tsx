import React, { useState, useEffect } from "react";
import styles from "./CommunityInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type ChildComponentProps = {
  triggerSendPost: ((func: () => void) => void) | null;
  toggleInputMode: (value: boolean) => void;
};

const CommunityInput: React.FC<ChildComponentProps> = ({
  triggerSendPost,
  toggleInputMode,
}) => {
  const [postMsg, setPostMsg] = useState("");
  const [postImg1, setPostImg1] = useState<File | null>(null);
  const [imgUrl1, setImgUrl1] = useState("");
  const [postImg2, setPostImg2] = useState<File | null>(null);
  const [imgUrl2, setImgUrl2] = useState("");
  const [postImg3, setPostImg3] = useState<File | null>(null);
  const [imgUrl3, setImgUrl3] = useState("");
  const [postImg4, setPostImg4] = useState<File | null>(null);
  const [imgUrl4, setImgUrl4] = useState("");

  const user = useSelector(selectUser);

  const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      if (postImg4) {
        return;
      } else if (postImg3) {
        setPostImg4(e.target.files![0]);
        setImgUrl4(URL.createObjectURL(e.target.files![0]));
        e.target.value = "";
      } else if (postImg2) {
        setPostImg3(e.target.files![0]);
        setImgUrl3(URL.createObjectURL(e.target.files![0]));
      } else if (postImg1) {
        setPostImg2(e.target.files![0]);
        setImgUrl2(URL.createObjectURL(e.target.files![0]));
      } else {
        setPostImg1(e.target.files![0]);
        setImgUrl1(URL.createObjectURL(e.target.files![0]));
      }
      e.target.value = "";
    }
  };

  const getFileName = async (image: File | null) => {
    if (image) {
      const timestamp = new Date();
      const parts = image.name.split(".");
      const extention = parts[parts.length - 1];
      const fileName = uuidv4() + ".jpg";
      return fileName;
    }
    return null;
  };

  //新投稿機能
  const sendPost = async () => {
    if (postMsg != "" || postImg1) {
      const imgName1 = await getFileName(postImg1);
      const imgName2 = await getFileName(postImg2);
      const imgName3 = await getFileName(postImg3);
      const imgName4 = await getFileName(postImg4);
      console.log(user.uid);
      await axios.post("http://localhost:5000/post/community/send", {
        uid: user.uid,
        text: postMsg,
        img1: imgName1,
        img2: imgName2,
        img3: imgName3,
        img4: imgName4,
      });
      if (postImg1 && imgName1) {
        const img = await fileToBase64(postImg1);
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
      if (postImg2) {
        await axios.post("http://localhost:5000/file/send", {
          img: postImg2,
          name: imgName2,
        });
      }
      if (postImg3) {
        await axios.post("http://localhost:5000/file/send", {
          img: postImg3,
          name: imgName3,
        });
      }
      if (postImg4) {
        await axios.post("http://localhost:5000/file/send", {
          img: postImg4,
          name: imgName4,
        });
      }
    }
    toggleInputMode(false);
  };

  useEffect(() => {
    if (triggerSendPost) {
      triggerSendPost(sendPost);
    }
  }, [
    postMsg,
    //putInFirestorageAndGetURL
  ]);

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
        {postImg1 && <img src={imgUrl1} />}
        {postImg2 && <img src={imgUrl2} />}
        {postImg3 && <img src={imgUrl3} />}
        {postImg4 && <img src={imgUrl4} />}
      </div>
    </div>
  );
};

export default CommunityInput;
