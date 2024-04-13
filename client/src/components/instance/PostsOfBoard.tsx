import React, { useState } from "react";
import styles from "./PostsOfBoard.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Avatar from "@material-ui/core";
import { AccountCircle, Delete, Edit } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import axios from "axios";

interface PROPS {
  gametitle: string;
  posttitle: string;
  postId: string;
  text: string;
  numOfMember: number;
  timestamp: any;
  timestampEdit: any;
  uid: string;
  username: string;
  profileId: string;
  avatar: string;
  onReload: () => void;
  setScreenMode: (value: string) => void;
  setUidOfProfileMode: (value: string) => void;
}

const PostsOfBoard: React.FC<PROPS> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentGameTitle, setCurrentGameTitle] = useState("");
  const [currentPostTitle, setCurrentPostTitle] = useState("");
  const [currentText, setCurrentText] = useState("");

  const user = useSelector(selectUser);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeScreenMode = (newValue: string) => {
    props.setScreenMode(newValue);
  };

  //新投稿編集機能
  const editPost = async (
    checkId: string,
    gameTitle: string,
    postTitle: string,
    postMsg: string
  ) => {
    if (
      currentGameTitle != gameTitle ||
      currentPostTitle != postTitle ||
      currentText != postMsg
    ) {
      await axios.put("http://localhost:5000/post/board/edit", {
        id: checkId,
        gameTitle: currentGameTitle,
        postTitle: currentPostTitle,
        postMsg: currentText,
      });
    }
    setIsEditMode(false);
    props.onReload();
  };

  //新投稿削除機能
  const deletePost = async (checkId: string) => {
    await axios.delete("http://localhost:5000/post/board/delete", {
      params: {
        id: checkId,
      },
    });
    props.onReload();
    console.log("executed!");
  };

  return (
    <div className={styles.posts_of_board}>
      <div className={styles.icon_name_id}>
        <span
          onClick={() => {
            props.uid == user.uid
              ? handleChangeScreenMode("MyProfile")
              : handleChangeScreenMode("UserProfile");
            props.setUidOfProfileMode(props.uid);
          }}
        >
          {props.avatar == "" ? (
            <AccountCircle className={styles.icon} />
          ) : (
            <></>
          )}
        </span>
        <div className={styles.name_id}>
          <p className={styles.username}>{props.username}</p>
          <p className={styles.id}>&nbsp;＠{props.profileId}</p>
        </div>
      </div>
      <div className={styles.timestamp_text}>
        <span>{new Date(props.timestamp).toLocaleString()}</span>
        {props.timestampEdit && (
          <p>{new Date(props.timestampEdit).toLocaleString()}編集済</p>
        )}
        {isEditMode ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={currentGameTitle}
              onChange={(e) => setCurrentGameTitle(e.target.value)}
            />
            <input
              type="text"
              value={currentPostTitle}
              onChange={(e) => setCurrentPostTitle(e.target.value)}
            />
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
            />
            <Button
              onClick={() =>
                editPost(
                  props.postId,
                  props.gametitle,
                  props.posttitle,
                  props.text
                )
              }
            >
              SEND
            </Button>
          </form>
        ) : (
          <>
            <p>ゲーム名：{props.gametitle}</p>
            <p>募集内容：{props.posttitle}</p>
            <p>募集人数：{props.numOfMember}</p>
            <p>{props.text}</p>
          </>
        )}
      </div>
      {props.uid == user.uid && (
        <div className={styles.btn_area}>
          <Button
            onClick={
              isEditMode
                ? () => {
                    setIsEditMode(false);
                  }
                : () => {
                    setIsEditMode(true);
                    setCurrentGameTitle(props.gametitle);
                    setCurrentPostTitle(props.posttitle);
                    setCurrentText(props.text);
                  }
            }
          >
            <Edit />
          </Button>
          <Button onClick={() => deletePost(props.postId)}>
            <Delete />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostsOfBoard;
