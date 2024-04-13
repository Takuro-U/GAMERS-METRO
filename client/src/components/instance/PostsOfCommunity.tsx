import React, { useEffect, useState } from "react";
import styles from "./PostsOfCommunity.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Button from "@material-ui/core/Button/Button";
import { Avatar, colors } from "@material-ui/core";
import {
  AccountCircle,
  ChatBubble,
  Delete,
  Edit,
  Send,
} from "@material-ui/icons";
import Comments from "./Comments";
import { text } from "stream/consumers";
import UserProfile from "../profile/UserProfile";
import axios from "axios";
import { response } from "express";

interface PROPS {
  postId: string;
  text: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  timestamp: any;
  timestampEdit: any;
  uid: string;
  username: string;
  profileId: string;
  avatar: string;
  onReload: () => void;
  setScreenMode: (value: string) => void;
  setUidOfProfileMode: (newValue: string) => void;
}

type Comment = {
  Id: string;
  ParentId: string;
  Uid: string;
  Text: string;
  Timestamp: any;
  TimestampEdit: any;
};

type User = {
  Uid: string;
  UserName: string;
  ProfileId: string;
  PhotoUrl: string;
};

const PostsOfCommunity: React.FC<PROPS> = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comment, setComment] = useState<Comment[]>([]);
  const [users, setUsers] = useState<{ [id: string]: any }>({});
  const [idOfOpeningComment, setIdOfOpeningComment] = useState("");
  const [reload, setReload] = useState(false);

  const user = useSelector(selectUser);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeScreenMode = (newValue: string) => {
    props.setScreenMode(newValue);
  };

  const handleChangeOpenningComment = (commentId: string) => {
    if (idOfOpeningComment == commentId) {
      setIdOfOpeningComment("");
    } else {
      setIdOfOpeningComment(commentId);
    }
  };

  //新投稿編集機能
  const editPost = async (checkId: string, text: string) => {
    if (currentText != text) {
      await axios.put("http://localhost:5000/post/community/edit", {
        id: checkId,
        text: currentText,
      });
    }
    setIsEditMode(false);
    props.onReload();
  };

  //新投稿削除機能
  const deletePost = async (checkId: string) => {
    await axios.delete("http://localhost:5000/post/community/delete", {
      params: {
        id: checkId,
      },
    });
    props.onReload();
  };

  //新コメント送信機能
  const sendComment = async () => {
    await axios.post("http://localhost:5000/comment/send", {
      parentId: props.postId,
      uid: user.uid,
      text: commentText,
    });
  };

  //新コメント取得機能
  const getComments = async () => {
    const commentResponse = await axios.get(
      "http://localhost:5000/comment/get",
      {
        params: {
          id: props.postId,
        },
      }
    );
    if (commentResponse.data.length != 0) {
      const commentData = commentResponse.data.map((comment: Comment) => ({
        Id: comment.Id,
        ParentId: comment.ParentId,
        Uid: comment.Uid,
        Text: comment.Text,
        Timestamp: comment.Timestamp,
        TimestampEdit: comment.TimestampEdit,
      }));
      setComment(commentData);

      const uniqueUids = Array.from(
        new Set(commentData.map((comment: Comment) => comment.Uid))
      );

      const userResponse = await axios.get("http://localhost:5000/user/list", {
        params: {
          idList: uniqueUids,
        },
      });

      const userData: { [Uid: string]: User } = {};
      userResponse.data.map(
        (content: User) =>
          (userData[content.Uid] = {
            Uid: content.Uid,
            UserName: content.UserName,
            ProfileId: content.ProfileId,
            PhotoUrl: content.PhotoUrl,
          })
      );
      setUsers(userData);
    } else {
      setComment([]);
    }
  };

  useEffect(() => {
    getComments();
  }, [reload]);

  return (
    <>
      <div className={styles.posts_of_community}>
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
            <>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                />
                <Button
                  type="submit"
                  onClick={() => editPost(props.postId, props.text)}
                >
                  send
                </Button>
              </form>
            </>
          ) : (
            <p>{props.text}</p>
          )}
        </div>
        {props.image1 && <img src={props.image1} />}
        {props.image2 && <img src={props.image2} />}
        {props.image3 && <img src={props.image3} />}
        {props.image4 && <img src={props.image4} />}
        <div className={styles.btn_area}>
          <Button onClick={() => setIsOpenComment(!isOpenComment)}>
            <ChatBubble />
          </Button>
          {props.uid == user.uid && (
            <>
              <Button
                onClick={
                  isEditMode
                    ? () => {
                        setIsEditMode(false);
                      }
                    : () => {
                        setIsEditMode(true);
                        setCurrentText(props.text);
                      }
                }
              >
                <Edit />
              </Button>
              <Button onClick={() => deletePost(props.postId)}>
                <Delete />
              </Button>
            </>
          )}
        </div>
      </div>
      {isOpenComment && (
        <>
          <div className={styles.comment_input}>
            <input
              type="text"
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button onClick={sendComment}>
              <Send />
            </Button>
          </div>
          <div className={styles.comments}>
            {comment.map((content) => (
              <Comments
                key={content.Id}
                commentId={content.Id}
                text={content.Text}
                image1={""}
                image2={""}
                image3={""}
                image4={""}
                timestamp={content.Timestamp}
                timestampEdit={content.TimestampEdit}
                uid={content.Uid}
                username={users[content.Uid]?.UserName}
                profileId={users[content.Uid]?.ProfileId}
                avatar={users[content.Uid]?.PhotoUrl}
                isOpenComment={idOfOpeningComment == content.Id}
                handleChangeOpening={handleChangeOpenningComment}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};
export default PostsOfCommunity;
