import { Button } from "@material-ui/core";
import styles from "./UserProfile.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { AccountCircle } from "@material-ui/icons";
import PostsOfBoard from "./../instance/PostsOfBoard";
import PostsOfCommunity from "./../instance/PostsOfCommunity";
import axios from "axios";

type PROPS = {
  uid: string;
  setScreenMode: (value: string) => void;
  setUidOfProfileMode: (value: string) => void;
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

const UserProfile: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);

  const [reload, setReload] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
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

  const noop = () => {};

  //新フォローチェック機能
  const checkFollow = async () => {
    const response = await axios.get("http://localhost:5000/follow/check", {
      params: {
        myUid: user.uid,
        othersUid: props.uid,
      },
    });
    setIsFollowing(response.data.following != null);
    setIsFollowed(response.data.followed != null);
  };

  //新フォロー機能
  const toggleFollowing = async () => {
    if (isFollowing) {
      await axios.delete("http://localhost:5000/follow/remove", {
        params: {
          follower: user.uid,
          followee: props.uid,
        },
      });
    } else {
      await axios.post("http://localhost:5000/follow/add", {
        follower: user.uid,
        followee: props.uid,
      });
    }
    setReload(!reload);
  };

  //新ユーザーデータ取得
  const getUserData = async () => {
    const response = axios.get("http://localhost:5000/user/get", {
      params: {
        uid: props.uid,
      },
    });
    setUserData({
      username: (await response).data.UserName,
      profileId: (await response).data.ProfileId,
      avatar: (await response).data.PhotoUrl,
      profileMessage: (await response).data.ProfileMessage,
    });
  };

  //新FFリスト取得機能
  const getFFList = async () => {
    const response = await axios.get("http://localhost:5000/follow/list", {
      params: {
        uid: props.uid,
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

  const getPostData = async () => {
    const boardResponse = await axios.get(
      "http://localhost:5000/post/board/user/get",
      {
        params: {
          uid: props.uid,
        },
      }
    );
    const communityResponse = await axios.get(
      "http://localhost:5000/post/community/user/get",
      {
        params: {
          uid: props.uid,
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
    }
  };

  useEffect(() => {
    getUserData();
    getPostData();
    getFFList();
    checkFollow();
  }, [reload]);

  return (
    <div>
      {listMode == "" && (
        <>
          <div className={styles.user_profile}>
            <div className={styles.fixed_square}>
              <div className={styles.profile_square}>
                <div className={styles.toggle_follow_btn}>
                  <Button onClick={toggleFollowing}>
                    {isFollowing ? "フォロー中" : "フォロー"}
                  </Button>
                </div>
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
                </div>
                <p>{userData.profileMessage}</p>
                <div className={styles.follow_and_followers}>
                  <Button onClick={() => setListMode("followUsers")}>
                    フォロー{followees.length}
                  </Button>
                  <Button onClick={() => setListMode("followers")}>
                    フォロワー{followers.length}
                  </Button>
                </div>
                <p className={styles.isFollowing}>
                  {isFollowed ? "フォローされています" : ""}
                </p>
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
                          uid={props.uid}
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
                          uid={props.uid}
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
        </>
      )}
      {listMode == "followUsers" && (
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
    </div>
  );
};

export default UserProfile;
