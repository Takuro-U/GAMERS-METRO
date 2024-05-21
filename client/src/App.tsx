import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import Auth from "./components/Auth";
import Main from "./components/Main";

import axios from "axios";

type UserData = {
  uid: string;
  userName: string;
  profileId: string;
  profileMsg: string;
  photoUrl: string;
  follower: number;
  followee: number;
};

const App: React.FC = () => {
  const domain = "https://gamers-metro.com:5000";
  //process.env.REACT_APP_API_DOMAIN;

  const resultOfTest = async () => {
    console.log(domain);
    const response = await axios.get(domain + "/api/test");
    return response;
  };

  const storedAuthUserData = localStorage.getItem("authUser");
  const initialAuthUser: UserData = storedAuthUserData
    ? JSON.parse(storedAuthUserData)
    : {
        uid: "",
        userName: "",
        profileId: "",
        profileMsg: "",
        photoUrl: "",
        follower: 0,
        followee: 0,
      };

  const [authUser, setAuthUser] = useState<UserData>(initialAuthUser);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  //新ログイン機能

  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    if (authUser.uid != "") {
      dispatch(
        login({
          uid: authUser.uid,
          photoUrl: authUser.photoUrl,
          displayName: authUser.userName,
          profileId: authUser.profileId,
          profileMsg: authUser.profileMsg,
        })
      );
    } else {
      dispatch(logout());
    }
  }, [authUser]);

  useEffect(() => {
    const test = async () => {
      console.log(await resultOfTest());
    };
    test();
  }, []);

  return (
    <div className={styles.App}>
      {user.uid ? (
        <Main handleChangeAuthUser={setAuthUser} />
      ) : (
        <Auth handleChangeAuthUser={setAuthUser} />
      )}
    </div>
  );
};

export default App;
