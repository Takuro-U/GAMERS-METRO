import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import styles from "./Setting.module.css";
import { Button } from "@material-ui/core";
import axios from "axios";

type PROPS = {
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

const Setting: React.FC<PROPS> = (props) => {
  const [screenMode, setScreenMode] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [messageLabel1, setMessageLabel1] = useState("現在のパスワード");
  const [messageLabel2, setMessageLabel2] = useState("新しいパスワード");
  const [messageLabel3, setMessageLabel3] = useState("パスワード再入力");
  const user = useSelector(selectUser);

  const logout = () => {
    props.handleChangeAuthUser({
      uid: "",
      userName: "",
      profileId: "",
      profileMsg: "",
      photoUrl: "",
      follower: 0,
      followee: 0,
    });
  };

  const checkPass = async ({
    newPass,
    rePass,
  }: {
    newPass: string;
    rePass: string;
  }) => {
    if ((newPass.length != 0 && newPass.length < 8) || newPass.length > 16) {
      setMessageLabel2("パスワードは8文字以上16文字以下にしてください");
    } else {
      setMessageLabel2("新しいパスワード");
    }
    if (newPass != rePass) {
      setMessageLabel3("パスワードが一致しません");
    } else {
      setMessageLabel3("パスワード再入力");
    }
  };

  const resetPass = async ({
    newPass,
    rePass,
  }: {
    newPass: string;
    rePass: string;
  }) => {
    if (newPass == rePass) {
      const response = await axios.put(
        "http://localhost:5000/auth/reset-pass",
        {
          uid: user.uid,
          currentPass: currentPass,
          newPass: newPass,
        }
      );
      if (response.data == true) {
        setScreenMode("");
      } else {
        alert("パスワードが違います");
      }
    }
  };

  useEffect(() => {
    checkPass({ newPass, rePass });
  }, [newPass, rePass]);

  return (
    <div className={styles.setting}>
      {screenMode == "" && (
        <>
          <div className={styles.btn_area}>
            <Button onClick={logout}>ログアウト</Button>
            <Button onClick={() => setScreenMode("resetPass")}>
              パスワード再設定
            </Button>
          </div>
        </>
      )}
      {screenMode == "resetPass" && (
        <>
          <div className={styles.form_area}>
            <p>{messageLabel1}</p>
            <div className={styles.form_wrapper}>
              <input
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentPass(e.target.value);
                }}
              />
            </div>
            <p>{messageLabel2}</p>
            <div className={styles.form_wrapper}>
              <input
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPass(e.target.value);
                }}
              />
            </div>
            <p>{messageLabel3}</p>
            <div className={styles.form_wrapper}>
              <input
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setRePass(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.btn_area}>
            <Button onClick={() => resetPass({ newPass, rePass })}>変更</Button>
            <Button onClick={() => setScreenMode("")}>戻る</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Setting;
