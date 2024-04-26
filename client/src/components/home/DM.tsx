import React, { useState, useEffect } from "react";
import styles from "./DM.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { AccountCircle } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import axios from "axios";

type PROPS = {
  toggleInputMode: (value: boolean) => void;
  setIsMessagesMode: (value: boolean) => void;
  isOpenTextForm: boolean;
  triggerSendMessase: ((func: () => void) => void) | null;
};

type USER = {
  Uid: string;
  UserName: string;
  ProfileId: string;
  PhotoUrl: string;
};

type Message = {
  Id: string;
  Message: string;
  ActiveUid: string;
  PassiveUid: string;
  Timestamp: any;
};

const DM: React.FC<PROPS> = (props) => {
  const [reload, setReload] = useState(false);
  const [chatMode, setChatMode] = useState("home");
  const [partner, setPartner] = useState("");
  const [listMode, setListMode] = useState("history");
  const [currentMessage, setCurrentMessage] = useState("");
  const [followees, setFollowees] = useState<USER[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<{ [Uid: string]: USER }>({});
  const [partnersData, setPartnersData] = useState<USER>({
    Uid: "",
    UserName: "",
    ProfileId: "",
    PhotoUrl: "",
  });
  const [lastMessages, setLastMessages] = useState<Message[]>([]);

  const [unSub, setUnSub] = useState<(() => void) | null>(null);

  const user = useSelector(selectUser);

  //フォローリスト取得機能
  const getFolloweeList = async () => {
    const response = await axios.get("http://localhost:5000/follow/list", {
      params: {
        uid: user.uid,
      },
    });
    const followeeList = response.data.followees.map((content: USER) => ({
      Uid: content.Uid,
      UserName: content.UserName,
      ProfileId: content.ProfileId,
      PhotoUrl: content.PhotoUrl,
    }));
    setFollowees(followeeList);
  };

  //ユーザーデータ取得機能
  const getUser = async (uid: string) => {
    const response = await axios.get("http://localhost:5000/user/get", {
      params: {
        uid: uid,
      },
    });
    setPartnersData({
      Uid: response.data.Uid,
      UserName: response.data.UserName,
      ProfileId: response.data.ProfileId,
      PhotoUrl: response.data.PhotoUrl,
    });
  };

  //メッセージ取得機能
  const getMessages = async (partnerUid: string) => {
    const response = await axios.get("http://localhost:5000/dm/get", {
      params: {
        uids: [user.uid, partnerUid],
      },
    });
    const messageData = response.data.map((content: Message) => ({
      Id: content.Id,
      Message: content.Message,
      ActiveUid: content.ActiveUid,
      PassiveUid: content.PassiveUid,
      Timestamp: content.Timestamp,
    }));
    setMessages(messageData);
  };

  //メッセージ履歴取得機能
  const getLastMessages = async () => {
    const response = await axios.get("http://localhost:5000/dm/last", {
      params: {
        uid: user.uid,
      },
    });
    if (response.data.length != 0) {
      const messageData = response.data.map((message: Message) => ({
        Id: message.Id,
        Message: message.Message,
        ActiveUid: message.ActiveUid,
        PassiveUid: message.PassiveUid,
        Timestamp: message.Timestamp,
      }));
      setLastMessages(messageData);

      const uniqueUids = Array.from(
        new Set(messageData.map((message: Message) => message.ActiveUid))
      );

      const userResponse = await axios.get("http://localhost:5000/user/list", {
        params: {
          idList: uniqueUids,
        },
      });
      const userData: { [Uid: string]: USER } = {};
      userResponse.data.map(
        (user: USER) =>
          (userData[user.Uid] = {
            Uid: user.Uid,
            UserName: user.UserName,
            ProfileId: user.ProfileId,
            PhotoUrl: user.PhotoUrl,
          })
      );
      setUsers(userData);
    }
  };

  const checkRoom = async (partnerUid: string) => {
    const response = await axios.get("http://localhost:5000/dm/room/check", {
      params: {
        uid1: user.uid,
        uid2: partnerUid,
      },
    });
    if (response.data) {
      console.log(response.data.Id);
      return response.data.Id;
    } else {
      console.log(response.data);
      return null;
    }
  };

  //新ルーム作成機能
  const createNewRoom = async (partnerUid: string) => {
    const response = await axios.post("http://localhost:5000/dm/room/create", {
      uid1: user.uid,
      uid2: partnerUid,
    });
    return response.data.Id;
  };

  const sendNewMessage = async (partnerUid: string) => {
    if (currentMessage != "") {
      let roomId;
      console.log(await checkRoom(partnerUid));
      if ((await checkRoom(partnerUid)) == null) {
        roomId = await createNewRoom(partnerUid);
      } else {
        roomId = await checkRoom(partnerUid);
      }
      await axios.post("http://localhost:5000/dm/send", {
        message: currentMessage,
        activeUid: user.uid,
        passiveUid: partnerUid,
        roomId: roomId,
      });
    }
    props.toggleInputMode(false);
    setReload(!reload);
  };

  useEffect(() => {
    getFolloweeList();
    getLastMessages();
    //props.setIsMessagesMode(false);
    if (chatMode == "messages") {
      getMessages(partner);
      getUser(partner);
    }
  }, [reload]);

  useEffect(() => {
    if (chatMode == "messages") {
      getMessages(partner);
      getUser(partner);
    }
    return () => {
      if (unSub) {
        unSub();
        setUnSub(null);
      }
    };
  }, [chatMode]);

  useEffect(() => {
    if (listMode == "history" && chatMode == "open") {
      getLastMessages();
    }
  }, [listMode, chatMode]);

  useEffect(() => {
    if (props.triggerSendMessase) {
      props.triggerSendMessase(() => sendNewMessage(partner));
    }
  }, [currentMessage]);

  return (
    <div className={styles.dm}>
      {chatMode == "home" && (
        <>
          <div className={styles.mode_select_btn_wrapper}>
            <Button onClick={() => setChatMode("open")}>
              <div className={styles.mode_select_btn_square}>
                <p className={styles.title}>オープンチャット</p>
              </div>
            </Button>
          </div>
          <div className={styles.mode_select_btn_wrapper}>
            <Button onClick={() => alert("準備中の機能です")}>
              <div className={styles.mode_select_btn_square}>
                <p className={styles.title}>プライベートチャット</p>
              </div>
            </Button>
          </div>
        </>
      )}
      {chatMode == "open" && (
        <>
          <div className={styles.content_btn}>
            <div className={styles.content_btn_side}>
              <Button onClick={() => setListMode("history")}>
                チャット履歴
              </Button>
            </div>
            <div className={styles.content_btn_center}>
              <Button onClick={() => setListMode("followUsers")}>
                フォロー中
              </Button>
            </div>
            <div className={styles.content_btn_side}>
              <Button
                onClick={() => {
                  //setListMode("friends");
                  alert("準備中の機能です");
                }}
              >
                フレンド
              </Button>
            </div>
          </div>
          {listMode == "history" && (
            <div className={styles.chat_history}>
              {!lastMessages[0]?.Id && (
                <p className={styles.no_data}>履歴がありません</p>
              )}
              {lastMessages.map((content) => (
                <React.Fragment key={content.Id}>
                  <Button
                    style={{ textTransform: "none" }}
                    onClick={() => {
                      setChatMode("messages");
                      {
                        content.ActiveUid == user.uid
                          ? setPartner(content.PassiveUid)
                          : setPartner(content.ActiveUid);
                      }
                      props.setIsMessagesMode(true);
                    }}
                  >
                    <div className={styles.list_btn_content}>
                      {users[content.ActiveUid].PhotoUrl == "" ? (
                        <AccountCircle className={styles.icon9} />
                      ) : (
                        <></>
                      )}

                      <p>{users[content.ActiveUid].UserName}</p>
                      <p>{users[content.ActiveUid].ProfileId}</p>
                      <p>
                        {content.ActiveUid == user.uid ? "自分" : "相手"}:
                        {content.Message}
                      </p>
                    </div>
                  </Button>
                </React.Fragment>
              ))}
            </div>
          )}
          {listMode == "followUsers" && (
            <div className={styles.followUsers}>
              {!followees[0]?.Uid && (
                <p className={styles.no_data}>
                  フォローしているユーザーはいません
                </p>
              )}
              {followees.map((content) => (
                <React.Fragment key={content.Uid}>
                  <Button
                    style={{ textTransform: "none" }}
                    onClick={() => {
                      setChatMode("messages");
                      setPartner(content.Uid);
                      props.setIsMessagesMode(true);
                    }}
                  >
                    <div className={styles.list_btn_content}>
                      {content.PhotoUrl == "" ? (
                        <AccountCircle className={styles.icon} />
                      ) : (
                        <></>
                      )}
                      <p>{content.UserName}</p>
                      <p>{content.ProfileId}</p>
                    </div>
                  </Button>
                </React.Fragment>
              ))}
            </div>
          )}
          {listMode == "friends" && <></>}
        </>
      )}
      {chatMode == "private" && <></>}
      {chatMode == "messages" && (
        <div className={styles.messages}>
          {props.isOpenTextForm && (
            <input
              type="text"
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
          )}
          {!messages[0]?.Id && (
            <div className={styles.no_message}>
              <p>メッセージはありません</p>
              <p>＋ボタンでメッセージを送信</p>
            </div>
          )}
          {messages.map((content) => (
            <React.Fragment key={content.Id}>
              <div
                className={
                  content.ActiveUid == user.uid
                    ? styles.myMessage
                    : styles.othersMessage
                }
              >
                <div className={styles.icon_text}>
                  {content.ActiveUid != user.uid && (
                    <>
                      {partnersData.PhotoUrl == "" ? <AccountCircle /> : <></>}
                    </>
                  )}
                  <p className={styles.text}>{content.Message}</p>
                </div>
                <p className={styles.timestamp}>
                  {new Date(content.Timestamp)?.toLocaleString()}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default DM;
