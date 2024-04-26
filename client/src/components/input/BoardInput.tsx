import React, { useState, useEffect } from "react";
import styles from "./BoardInput..module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import axios from "axios";

type PROPS = {
  triggerSendPost: ((func: () => void) => void) | null;
  toggleInputMode: (value: boolean) => void;
};

const BoardInput: React.FC<PROPS> = (props) => {
  const [gameTitle, setGameTitle] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [numOfmember, setNumOfMember] = useState("");
  const [postMsg, setPostMsg] = useState("");

  const user = useSelector(selectUser);

  //新投稿機能
  const sendPost = async () => {
    if (gameTitle != "" && postTitle != "" && postMsg != "") {
      await axios.post("http://localhost:5000/post/board/send", {
        uid: user.uid,
        gameTitle: gameTitle,
        postTitle: postTitle,
        numOfmember: numOfmember,
        postMsg: postMsg,
      });
    }
    props.toggleInputMode(false);
  };

  useEffect(() => {
    if (props.triggerSendPost) {
      props.triggerSendPost(sendPost);
    }
  }, [gameTitle, postTitle, postMsg]);

  return (
    <div className={styles.form_area}>
      <div className={styles.form_wrapper}>
        <input
          type="text"
          placeholder="ゲームタイトル"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
        />
      </div>
      <div className={styles.form_wrapper}>
        <input
          type="text"
          placeholder="投稿タイトル"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
      </div>
      <div className={styles.form_wrapper}>
        <input
          type="text"
          placeholder="募集人数"
          value={numOfmember}
          onChange={(e) => setNumOfMember(e.target.value)}
        />
      </div>
      <div className={styles.form_wrapper}>
        <textarea
          placeholder="募集内容"
          value={postMsg}
          onChange={(e) => setPostMsg(e.target.value)}
        />
      </div>
    </div>
  );
};

export default BoardInput;
