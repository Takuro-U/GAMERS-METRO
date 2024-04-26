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
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newText, setNewText] = useState("");

  const user = useSelector(selectUser);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeScreenMode = (newValue: string) => {
    props.setScreenMode(newValue);
  };

  //新投稿編集機能
  const editPost = async () => {
    if (
      newGameTitle != props.gametitle ||
      newPostTitle != props.posttitle ||
      newText != props.text
    ) {
      await axios.put("http://localhost:5000/post/board/edit", {
        id: props.postId,
        gameTitle: newGameTitle,
        postTitle: newPostTitle,
        postMsg: newText,
      });
    }
    setIsEditMode(false);
    props.onReload();
  };

  //新投稿削除機能
  const deletePost = async () => {
    await axios.delete("http://localhost:5000/post/board/delete", {
      params: {
        id: props.postId,
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
              value={newGameTitle}
              onChange={(e) => setNewGameTitle(e.target.value)}
            />
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <Button onClick={editPost}>SEND</Button>
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
                    setNewGameTitle(props.gametitle);
                    setNewPostTitle(props.posttitle);
                    setNewText(props.text);
                  }
            }
          >
            <Edit />
          </Button>
          <Button onClick={deletePost}>
            <Delete />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostsOfBoard;
