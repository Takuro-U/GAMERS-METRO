import React, { useState, useEffect } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
  setRef,
} from "@material-ui/core";
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

const Auth: React.FC<PROPS> = (props) => {
  const dispatch = useDispatch();
  const [profileId, setProfileId] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [oneTimePass, setOneTimePass] = useState("");

  const [messageLabel1, setMessageLabel1] = useState("UserID");
  const [messageLabel2, setMessageLabel2] = useState("Password");
  const [messageLabel3, setMessageLabel3] = useState("Password");

  const [isLogimMode, setIsLoginMode] = useState(true);
  const [waitingResponse, setWaitingResponse] = useState("");

  const domain = process.env.REACT_APP_API_DOMAIN;

  const cleanUp = async () => {
    setProfileId("");
    setEmail("");
    setPassword("");
    setRePassword("");
  };

  //uidチェック
  const checkId = async () => {
    try {
      if (profileId.length != 0) {
        if (profileId.length > 16 || profileId.length < 8) {
          setMessageLabel1("IDは8文字以上16文字以下にしてください");
          return;
        } else {
          const response = await axios.get(domain + "/auth/idlist/", {
            params: {
              id: profileId,
            },
          });
          if (response.data != null) {
            setMessageLabel1("そのIDは既に使用されています");
            return;
          }
        }
      }
      setMessageLabel1("UserID");
    } catch (error) {
      console.log(error);
    }
  };

  //パスワードチェック
  const checkPassword = () => {
    if (password.length != 0) {
      if (password.length < 8) {
        setMessageLabel2("パスワードは8文字以上にしてください");
        return;
      }
    }
    setMessageLabel2("Password");
  };

  //パスワード再入力チェック
  const checkRePassword = () => {
    if (rePassword.length != 0) {
      if (password != rePassword) {
        setMessageLabel3("パスワードが一致しません");
        return;
      }
    }
    setMessageLabel3("Password");
  };

  //アカウント存在チェック
  const searchedAccount = async () => {
    const response = await axios.get(domain + "/auth/search", {
      params: {
        emailOrProfileId: email,
      },
    });
    const result = response.data.Email;
    return result;
  };

  //Emailログイン機能
  const logInWithEmail = async () => {
    try {
      const response = await axios.get(domain + "/auth/login/email", {
        params: {
          email: address,
          password: password,
        },
      });
      props.handleChangeAuthUser({
        uid: response.data.Uid,
        userName: response.data.UserName,
        profileId: response.data.ProfileId,
        profileMsg: response.data.ProfileMsg,
        photoUrl: response.data.PhotoUrl,
        follower: response.data.Follower,
        followee: response.data.Followee,
      });
      await axios.delete(domain + "/auth/otp-reset", {
        params: {
          email: address,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //ワンタイムパスワード送信機能
  const sendEmail = async () => {
    if (email != "") {
      let addressToSend = email;
      if (isLogimMode) {
        console.log(await searchedAccount());
        addressToSend = await searchedAccount();
        console.log(addressToSend);
      }
      await axios.post(domain + "/auth/email", {
        address: addressToSend,
      });
      setAddress(addressToSend);
      if (waitingResponse == "") {
        setWaitingResponse("otp_login");
      } else if (waitingResponse == "id_or_email") {
        setWaitingResponse("otp_reset");
      }
    }
  };

  //サインアップ機能
  const handleSignUp = async () => {
    try {
      const response = await axios.get(domain + "/auth/otpcheck", {
        params: {
          email: email,
          otp: oneTimePass,
        },
      });
      if (response.data == true) {
        await axios.post(domain + "/auth/signup", {
          profileId: profileId,
          email: email,
          password: password,
        });

        logInWithEmail();
      } else {
        alert("認証に失敗しました");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkId();
  }, [profileId]);

  useEffect(() => {
    if (!isLogimMode) {
      checkPassword();
    }
  }, [password]);

  useEffect(() => {
    if (!isLogimMode) {
      checkRePassword();
    }
  }, [password, rePassword]);

  useEffect(() => {
    cleanUp();
  }, [isLogimMode]);

  return (
    <div>
      {waitingResponse == "" && (
        <div>
          <form className={styles.form_area}>
            {!isLogimMode && (
              <>
                <p>{messageLabel1}</p>
                <div className={styles.form_wrapper}>
                  <input
                    type="text"
                    value={profileId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setProfileId(e.target.value);
                    }}
                  />
                </div>
              </>
            )}
            {isLogimMode ? <p>Email or UserID</p> : <p>Email</p>}
            <div className={styles.form_wrapper}>
              <input
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <p>{isLogimMode ? "Password" : messageLabel2}</p>
            <div className={styles.form_wrapper}>
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            {!isLogimMode && (
              <>
                <p>{messageLabel3}</p>
                <div className={styles.form_wrapper}>
                  <input
                    type="password"
                    value={rePassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRePassword(e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </form>
          <div className={styles.btn_area}>
            <Button
              onClick={async () => {
                try {
                  await sendEmail();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
            >
              {isLogimMode ? "LOGIN" : "REGISTER"}
            </Button>
          </div>
          <p
            className={styles.underline}
            onClick={() => setIsLoginMode(!isLogimMode)}
          >
            {isLogimMode ? "新規登録はこちら" : "ログインはこちら"}
          </p>
          <p
            className={styles.underline}
            onClick={() => setWaitingResponse("id_or_email")}
          >
            パスワードを忘れた場合
          </p>
        </div>
      )}
      {waitingResponse == "otp_login" && (
        <form>
          <input
            type="text"
            value={oneTimePass}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOneTimePass(e.target.value);
            }}
          />
          <Button
            onClick={
              isLogimMode
                ? async () => {
                    try {
                      await logInWithEmail();
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }
                : async () => {
                    try {
                      await handleSignUp();
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }
            }
          >
            OK
          </Button>
        </form>
      )}
      {waitingResponse == "id_or_email" && (
        <>
          <div className={styles.form_area}>
            <p>Email or UserID</p>
            <div className={styles.form_wrapper}>
              <input
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <Button onClick={sendEmail}>OK</Button>
          </div>
          <p
            className={styles.underline}
            onClick={() => setWaitingResponse("")}
          >
            戻る
          </p>
        </>
      )}
      {waitingResponse == "otp_reset" && (
        <>
          <form>
            <input
              type="text"
              value={oneTimePass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setOneTimePass(e.target.value);
              }}
            />
            <Button onClick={() => setWaitingResponse("reset_pass")}>OK</Button>
          </form>
        </>
      )}
      {waitingResponse == "reset_pass" && (
        <>
          <p>リセット</p>
        </>
      )}
    </div>
  );
};

export default Auth;
