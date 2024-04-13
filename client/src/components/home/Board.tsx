import React, { useState, useEffect } from "react";
import styles from "./Board.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import PostsOfBoard from "../instance/PostsOfBoard";
import axios from "axios";
import { Button, colors } from "@material-ui/core";

type PROPS = {
  setScreenMode: (value: string) => void;
  setUidOfProfileMode: (value: string) => void;
  keyWords: string[];
};

type Post = {
  Id: string;
  Uid: string;
  GameTitle: string;
  PostTitle: string;
  Member: number;
  PostMsg: string;
  Timestamp: any;
  TimestampEdit: any;
};

type User = {
  Uid: string;
  UserName: string;
  ProfileId: string;
  PhotoUrl: string;
};

const Board: React.FC<PROPS> = (props) => {
  const [reload, setReload] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [Uid: string]: User }>({});

  //新投稿取得機能
  const getPosts = async () => {
    const postResponse = await axios.get(
      "http://localhost:5000/post/board/get"
    );
    if (postResponse.data.length != 0) {
      const postData = postResponse.data.map((post: Post) => ({
        Id: post.Id,
        Uid: post.Uid,
        GameTitle: post.GameTitle,
        PostTitle: post.PostTitle,
        Member: post.Member,
        PostMsg: post.PostMsg,
        Timestamp: post.Timestamp,
        TimestampEdit: post.TimestampEdit,
      }));
      setPosts(postData);

      const uniqueUids = Array.from(
        new Set(postData.map((post: Post) => post.Uid))
      );

      const userResponse = await axios.get("http://localhost:5000/user/list", {
        params: {
          idList: uniqueUids,
        },
      });

      const userData: { [Uid: string]: User } = {};
      userResponse.data.map(
        (user: User) =>
          (userData[user.Uid] = {
            Uid: user.Uid,
            UserName: user.UserName,
            ProfileId: user.ProfileId,
            PhotoUrl: user.PhotoUrl,
          })
      );
      setUsers(userData);
    } else {
      setPosts([]);
    }
  };

  //投稿検索機能
  const searchPosts = async () => {
    const postResponse = await axios.get(
      "http://localhost:5000/post/board/search",
      {
        params: {
          keyWords: props.keyWords,
        },
      }
    );
    if (postResponse.data.length != 0) {
      const postData = postResponse.data.map((post: Post) => ({
        Id: post.Id,
        Uid: post.Uid,
        GameTitle: post.GameTitle,
        PostTitle: post.PostTitle,
        Member: post.Member,
        PostMsg: post.PostMsg,
        Timestamp: post.Timestamp,
        TimestampEdit: post.TimestampEdit,
      }));
      setPosts(postData);

      const uniqueUids = Array.from(
        new Set(postData.map((post: Post) => post.Uid))
      );

      const userResponse = await axios.get("http://localhost:5000/user/list", {
        params: {
          idList: uniqueUids,
        },
      });

      const userData: { [Uid: string]: User } = {};

      userResponse.data.map(
        (user: User) =>
          (userData[user.Uid] = {
            Uid: user.Uid,
            UserName: user.UserName,
            ProfileId: user.ProfileId,
            PhotoUrl: user.PhotoUrl,
          })
      );
      setUsers(userData);
    } else {
      setPosts([]);
    }
  };

  useEffect(() => {
    getPosts();
  }, [reload]);

  useEffect(() => {
    if (props.keyWords[0] == "") {
      getPosts();
    } else {
      console.log("executed");
      searchPosts();
    }
  }, [props.keyWords]);

  return (
    <div>
      <div className={styles.posts}>
        {posts[0]?.Id && (
          <>
            {posts.map((post) => (
              <PostsOfBoard
                key={post.Id}
                postId={post.Id}
                gametitle={post.GameTitle}
                posttitle={post.PostTitle}
                numOfMember={post.Member}
                text={post.PostMsg}
                timestamp={post.Timestamp}
                timestampEdit={post.TimestampEdit}
                uid={post.Uid}
                username={users[post.Uid]?.UserName}
                profileId={users[post.Uid]?.ProfileId}
                avatar={users[post.Uid]?.PhotoUrl}
                onReload={() => setReload(!reload)}
                setScreenMode={props.setScreenMode}
                setUidOfProfileMode={props.setUidOfProfileMode}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Board;
