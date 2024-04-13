import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import styles from "./Comments.module.css";
import { AccountCircle, ChatBubble, Send } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import axios from "axios";

type PROPS = {
  commentId: string;
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
  isOpenComment: boolean;
  handleChangeOpening: (value: string) => void;
};

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

const Comments: React.FC<PROPS> = (props) => {
  const [commentText, setCommentText] = useState("");
  const [comment, setComment] = useState<Comment[]>([]);
  const [users, setUsers] = useState<{ [id: string]: any }>({});

  const [idOfOpeningComment, setIdOfOpeningComment] = useState("");

  const [reload, setReload] = useState(false);

  const user = useSelector(selectUser);

  const handleChangeOpenningComment = (commentId: string) => {
    if (idOfOpeningComment == commentId) {
      setIdOfOpeningComment("");
    } else {
      setIdOfOpeningComment(commentId);
    }
  };

  const handleWheelEvent = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  //新コメント送信機能
  const sendComment = async () => {
    await axios.post("http://localhost:5000/comment/send", {
      parentId: props.commentId,
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
          id: props.commentId,
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
    <div className={styles.comments_parent}>
      <div className={styles.comment_square}>
        <div className={styles.icon_name}>
          {props.avatar == "" ? (
            <AccountCircle className={styles.icon} />
          ) : (
            <></>
          )}
          <p>{props.username}</p>
        </div>
        <p className={styles.text}>{props.text}</p>
        <Button onClick={() => props.handleChangeOpening(props.commentId)}>
          <ChatBubble />
        </Button>
      </div>
      {props.isOpenComment && (
        <>
          <form className={styles.comment_form}>
            <input
              type="text"
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button onClick={sendComment}>
              <Send />
            </Button>
          </form>
          <div className={styles.comments_child} onWheel={handleWheelEvent}>
            {comment[0]?.Id && (
              <>
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
