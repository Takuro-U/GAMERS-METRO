import React, { useState, useEffect } from "react";
import styles from "./Community.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import PostsOfCommunity from "../instance/PostsOfCommunity";
import axios from "axios";
import { get } from "http";
import { response } from "express";

type PROPS = {
  setScreenMode: (value: string) => void;
  setUidOfProfile: (newValue: string) => void;
  keyWords: string[];
};

type Post = {
  Id: string;
  Uid: string;
  Text: string;
  Img1: string;
  Img2: string;
  Img3: string;
  Img4: string;
  Timestamp: any;
  TimestampEdit: any;
};

type User = {
  Uid: string;
  UserName: string;
  ProfileId: string;
  PhotoUrl: string;
};

const Community: React.FC<PROPS> = (props) => {
  const [reload, setReload] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [id: string]: any }>({});

  //新投稿取得機能
  const getPosts = async () => {
    const postResponse = await axios.get(
      "http://localhost:5000/post/community/get"
    );
    if (postResponse.data.length != 0) {
      const postDataPromises: Post[] = postResponse.data.map(
        async (post: Post) => ({
          Id: post.Id,
          Uid: post.Uid,
          Text: post.Text,
          Img1: await receiveImgData(post.Img1),
          Img2: await receiveImgData(post.Img2),
          Img3: await receiveImgData(post.Img3),
          Img4: await receiveImgData(post.Img4),
          Timestamp: post.Timestamp,
          TimestampEdit: post.TimestampEdit,
        })
      );

      const postData = await Promise.all(postDataPromises);

      setPosts(postData);

      const uniqueUids = Array.from(
        new Set(postData.map((post: Post) => post.Uid))
      );

      const userResponse = await axios.get("http://localhost:5000/user/list", {
        params: {
          idList: uniqueUids,
        },
      });

      console.log(userResponse.data);

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
  const searchPosts = async (keyWords: string[]) => {
    const postResponse = await axios.get(
      "http://localhost:5000/post/community/search",
      {
        params: {
          keyWords: keyWords,
        },
      }
    );
    if (postResponse.data.length != 0) {
      const postDataPromises: Post[] = postResponse.data.map(
        async (post: Post) => ({
          Id: post.Id,
          Uid: post.Uid,
          Text: post.Text,
          Img1: await receiveImgData(post.Img1),
          Img2: await receiveImgData(post.Img2),
          Img3: await receiveImgData(post.Img3),
          Img4: await receiveImgData(post.Img4),
          Timestamp: post.Timestamp,
          TimestampEdit: post.TimestampEdit,
        })
      );

      const postData = await Promise.all(postDataPromises);
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

  //画像取得機能
  const receiveImgData = async (imgName: string | null) => {
    if (imgName != null) {
      const response = await axios.get("http://localhost:5000/file/get", {
        params: {
          imgName: imgName,
        },
      });
      const base64Data = response.data;
      const decordedData = Uint8Array.from(atob(base64Data as string), (c) =>
        c.charCodeAt(0)
      );
      const blobObject = new Blob([decordedData], { type: "image/jpeg" });
      const url = URL.createObjectURL(blobObject);
      return url;
    } else {
      return "";
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
      searchPosts(props.keyWords);
    }
  }, [props.keyWords]);

  return (
    <div>
      <div className={styles.posts}>
        {posts[0]?.Id && (
          <>
            {posts.map((post) => (
              <PostsOfCommunity
                key={post.Id}
                postId={post.Id}
                text={post.Text}
                image1={post.Img1}
                image2={post.Img2}
                image3={post.Img3}
                image4={post.Img4}
                timestamp={post.Timestamp}
                timestampEdit={post.TimestampEdit}
                uid={post.Uid}
                username={users[post.Uid]?.UserName}
                profileId={users[post.Uid]?.ProfileId}
                avatar={users[post.Uid]?.PhotoUrl}
                onReload={() => setReload(!reload)}
                setScreenMode={props.setScreenMode}
                setUidOfProfileMode={props.setUidOfProfile}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Community;
