import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import Auth from "./components/Auth";
import Main from "./components/Main";

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
