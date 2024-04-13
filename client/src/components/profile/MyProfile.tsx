import { Button } from "@material-ui/core";
import styles from "./MyProfile.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { AccountCircle } from "@material-ui/icons";
import PostsOfBoard from "./../instance/PostsOfBoard";
import PostsOfCommunity from "./../instance/PostsOfCommunity";
import axios from "axios";

type PROPS = {
  changeMode: (value: string) => void;
  setScreenMode: (value: string) => void;
  setUidOfProfileMode: (value: string) => void;
  handleChangeAuthUser: (value: {
    uid: string;
    userName: string;
    profileId: string;
    profileMsg: string;
    photoUrl: string;
    follower: number;
    followee: number;
  }) => void;
};

type USER = {
  uid: string;
  userName: string;
  profileId: string;
  photoUrl: string;
};

type BOARD = {
  Id: string;
  Uid: string;
  GameTitle: string;
  PostTitle: string;
  Member: number;
  PostMsg: string;
  Timestamp: any;
  TimestampEdit: any;
};

type COMMUNITY = {
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

const MyProfile: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);

  const [reload, setReload] = useState(false);
  const [listMode, setListMode] = useState("");
  const [profileMode, setProfileMode] = useState("Board");
  const [userData, setUserData] = useState({
    username: "",
    profileId: "",
    avatar: "",
    profileMessage: "",
  });
  const [followees, setFollowees] = useState<USER[]>([]);
  const [followers, setFollowers] = useState<USER[]>([]);
  const [postsOfBoard, setPostsOfBoard] = useState<BOARD[]>([]);
  const [postsOfCommunity, setPostsOfCommunity] = useState<COMMUNITY[]>([]);

  const [newUserName, setNewUserName] = useState(user.displayName);
  const [newId, setNewId] = useState(user.profileId);
  const [newMsg, setNewMsg] = useState(user.profileMsg);
  const [messageLabel1, setMessageLabel1] = useState("ユーザー名");
  const [messageLabel2, setMessageLabel2] = useState("ユーザーID");
  const [messageLabel3, setMessageLabel3] = useState("プロフィール");

  const noop = () => {};

  //新ユーザーデータ取得機能
  const getUserData = async () => {
    const response = await axios.get("http://localhost:5000/user/get", {
      params: {
        uid: user.uid,
      },
    });
    setUserData({
      username: response.data.UserName,
      profileId: response.data.ProfileId,
      avatar: response.data.PhotoUrl,
      profileMessage: response.data.ProfileMessage,
    });
  };

  //新FFリスト取得機能
  const getFFList = async () => {
    const response = await axios.get("http://localhost:5000/follow/list", {
      params: {
        uid: user.uid,
      },
    });
    const followerList = response.data.followers.map((content: USER) => ({
      uid: content.uid,
      userName: content.userName,
      profileId: content.userName,
      photoUrl: content.profileId,
    }));
    const followeeList = response.data.followees.map((content: USER) => ({
      uid: content.uid,
      userName: content.userName,
      profileId: content.userName,
      photoUrl: content.profileId,
    }));
    setFollowers(followerList);
    setFollowees(followeeList);
  };

  //新投稿取得機能
  const getPostData = async () => {
    const boardResponse = await axios.get(
      "http://localhost:5000/post/board/user/get",
      {
        params: {
          uid: user.uid,
        },
      }
    );
    const communityResponse = await axios.get(
      "http://localhost:5000/post/community/user/get",
      {
        params: {
          uid: user.uid,
        },
      }
    );
    if (boardResponse.data.length != 0) {
      const boardData = boardResponse.data.map((post: BOARD) => ({
        Id: post.Id,
        Uid: post.Uid,
        GameTitle: post.GameTitle,
        PostTitle: post.PostTitle,
        PostMsg: post.PostMsg,
        Timestamp: post.Timestamp,
        TimestampEdit: post.TimestampEdit,
      }));
      setPostsOfBoard(boardData);
    } else {
      setPostsOfBoard([]);
    }
    if (communityResponse.data.length != 0) {
      const communityData = communityResponse.data.map((post: COMMUNITY) => ({
        Id: post.Id,
        Uid: post.Uid,
        Text: post.Text,
        Img1: post.Img1,
        Img2: post.Img2,
        Img3: post.Img3,
        Img4: post.Img4,
        Timestamp: post.Timestamp,
        TimestampEdit: post.TimestampEdit,
      }));
      setPostsOfCommunity(communityData);
    } else {
      setPostsOfCommunity([]);
    }
  };

  const checkUserName = async () => {
    if (newUserName.length > 16) {
      setMessageLabel1("ユーザー名は16文字以下にしてください");
      return;
    }
    setMessageLabel1("ユーザー名");
  };

  const checkId = async () => {
    if (newId.length != 0 && newId != user.profileId) {
      if (newId.length > 16 || newId.length < 8) {
        setMessageLabel2("IDは8文字以上16文字以下にしてください");
        return;
      } else {
        const response = await axios.get("http://localhost:5000/auth/idlist/", {
          params: {
            id: newId,
          },
        });
        console.log(newId);
        if (response.data != null) {
          setMessageLabel2("そのIDは既に使用されています");
          return;
        }
      }
    }
    setMessageLabel2("ユーザーID");
  };

  const checkMsg = async () => {
    if (newMsg.length > 255) {
      setMessageLabel3("プロフィールは255文字以下にしてください");
      return;
    }
    setMessageLabel3("プロフィール");
  };

  const updateProfile = async () => {
    const userName = newUserName;
    const profileId = newId;
    const msg = newMsg;
    if (
      userName.length != 0 &&
      userName.length < 17 &&
      profileId.length > 7 &&
      profileId.length < 17 &&
      msg.length < 256
    ) {
      await axios.put("http://localhost:5000/user/update/", {
        uid: user.uid,
        userName: userName,
        profileId: profileId,
        msg: msg,
      });
      const response = await axios.get("http://localhost:5000/user/get/", {
        params: {
          uid: user.uid,
        },
      });
      props.handleChangeAuthUser({
        uid: user.uid,
        userName: response.data.UserName,
        profileId: response.data.ProfileId,
        profileMsg: response.data.ProfileMsg,
        photoUrl: response.data.PhotoUrl,
        follower: response.data.Follower,
        followee: response.data.Followee,
      });
      setListMode("");
    }
  };

  useEffect(() => {
    getUserData();
    getPostData();
    getFFList();
    console.log("reloaded!");
  }, [reload]);

  useEffect(() => {
    checkUserName();
  }, [newUserName]);

  useEffect(() => {
    checkId();
  }, [newId]);

  useEffect(() => {
    checkMsg();
  }, [newMsg]);

  useEffect(() => {}, [newMsg]);

  return (
    <div>
      {listMode == "" && (
        <div className={styles.my_profile}>
          <div className={styles.fixed_square}>
            <div className={styles.profile_square}>
              <Button
                className={styles.setting_btn}
                onClick={() => setListMode("editProfile")}
              >
                プロフィール設定
              </Button>
              <div className={styles.icon_name_id}>
                {userData.avatar == "" ? (
                  <AccountCircle className={styles.icon} />
                ) : (
                  <></>
                )}
                <div className={styles.name_id}>
                  <p className={styles.username}>{userData.username}</p>
                  <p className={styles.id}>{userData.profileId}</p>
                </div>
                <p>{userData.profileMessage}</p>
              </div>
              <div className={styles.follow_and_followers}>
                <Button onClick={() => setListMode("followees")}>
                  フォロー{followees.length}
                </Button>
                <Button onClick={() => setListMode("followers")}>
                  フォロワー{followers.length}
                </Button>
              </div>
            </div>
            <div className={styles.content_btn}>
              <div className={styles.content_btn_side}>
                <Button
                  onClick={() => {
                    setProfileMode("Board");
                  }}
                >
                  掲示板
                </Button>
              </div>
              <div className={styles.content_btn_center}>
                <Button
                  onClick={() => {
                    setProfileMode("Community");
                  }}
                >
                  コミュニティ
                </Button>
              </div>
              <div className={styles.content_btn_side}>
                <Button
                  onClick={() => {
                    setProfileMode("Comment");
                  }}
                >
                  コメント
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.posts}>
            {profileMode == "Board" && (
              <>
                {postsOfBoard[0]?.Id && (
                  <>
                    {postsOfBoard.map((post) => (
                      <PostsOfBoard
                        key={post.Id}
                        postId={post.Id}
                        gametitle={post.GameTitle}
                        posttitle={post.PostTitle}
                        numOfMember={post.Member}
                        text={post.PostMsg}
                        timestamp={post.Timestamp}
                        timestampEdit={post.TimestampEdit}
                        uid={user.uid}
                        username={userData.username}
                        profileId={userData.profileId}
                        avatar={userData.avatar}
                        onReload={() => setReload(!reload)}
                        setScreenMode={noop}
                        setUidOfProfileMode={noop}
                      />
                    ))}
                  </>
                )}
              </>
            )}
            {profileMode == "Community" && (
              <>
                {postsOfCommunity[0]?.Id && (
                  <>
                    {postsOfCommunity.map((post) => (
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
                        uid={user.uid}
                        username={userData.username}
                        profileId={userData.profileId}
                        avatar={userData.avatar}
                        onReload={() => setReload(!reload)}
                        setScreenMode={noop}
                        setUidOfProfileMode={noop}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {listMode == "followees" && (
        <>
          {followees.map((content) => (
            <React.Fragment key={content.uid}>
              <Button
                onClick={() => {
                  props.setScreenMode("UserProfile");
                  props.setUidOfProfileMode(content.uid);
                }}
              >
                {content.photoUrl == "" ? <AccountCircle /> : <></>}
                <span>{content.userName}</span>
                <span>@{content.profileId}</span>
              </Button>
            </React.Fragment>
          ))}
        </>
      )}
      {listMode == "followers" && (
        <>
          {followers.map((content) => (
            <React.Fragment key={content.uid}>
              <Button
                onClick={() => {
                  props.setScreenMode("UserProfile");
                  props.setUidOfProfileMode(content.uid);
                }}
              >
                {content.photoUrl == "" ? <AccountCircle /> : <></>}
                <span>{content.userName}</span>
                <span>@{content.profileId}</span>
              </Button>
            </React.Fragment>
          ))}
        </>
      )}
      {listMode == "editProfile" && (
        <div className={styles.form_area}>
          <p className={styles.message}>{messageLabel1}</p>
          <div className={styles.form_wrapper}>
            <input
              type="text"
              value={newUserName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewUserName(e.target.value);
              }}
            />
          </div>
          <p className={styles.message}>{messageLabel2}</p>
          <div className={styles.form_wrapper}>
            <input
              type="text"
              value={newId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewId(e.target.value);
              }}
            />
          </div>
          <p className={styles.message}>{messageLabel3}</p>
          <div className={styles.form_wrapper}>
            <textarea
              value={newMsg}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setNewMsg(e.target.value);
              }}
            ></textarea>
          </div>
          <div className={styles.submit_btn}>
            <Button
              onClick={() => {
                updateProfile();
              }}
            >
              更新
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
