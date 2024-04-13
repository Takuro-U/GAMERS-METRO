import React, { useState, useRef, useEffect } from "react";
import styles from "./Main.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar, Button } from "@material-ui/core";
import {
  AccountCircle,
  Chat,
  Email,
  FilterFrames,
  Mail,
  Search,
  Send,
  Settings,
} from "@material-ui/icons";
import Board from "./home/Board";
import Community from "./home/Community";
import DM from "./home/DM";
import Setting from "./home/Setting";
import BoardInput from "./input/BoardInput";
import CommunityInput from "./input/CommunityInput";
import MyProfile from "./profile/MyProfile";
import UserProfile from "./profile/UserProfile";
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

const Main: React.FC<PROPS> = (props) => {
  const [screenMode, setScreenMode] = useState("Board");
  const [profileMode, setProfileMode] = useState("Board");
  const [uidOfProfileMode, setUidOfProfileMode] = useState("");
  const [isOpenHeaderProfile, setIsOpenHeaderProfile] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const [isMessagesMode, setIsMessagesMode] = useState(false);

  const [searchWord, setSearchWord] = useState("");
  const [keyWords, setKeyWords] = useState([""]);

  const user = useSelector(selectUser);

  const handleProfileModeChange = (newValue: string) => {
    setProfileMode(newValue);
  };

  const toggleIsInputModeChange = (newValue: boolean) => {
    setIsInputMode(newValue);
  };

  const sendPostFunctionRef = useRef<(() => void) | null>(null);

  const handleSendPost = () => {
    if (sendPostFunctionRef.current) {
      sendPostFunctionRef.current();
    }
  };

  const splitedWords = () => {
    const words = searchWord.split(/[ 　]+/);
    return words;
  };

  const updateKeyWords = async () => {
    const words = await splitedWords();
    setKeyWords(words);
  };

  return (
    <div>
      <header>
        <div className={styles.header_bar}>
          <div className={styles.search_bar}>
            <input
              type="text"
              value={searchWord}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchWord(e.target.value);
              }}
            />

            <Button onClick={updateKeyWords}>
              <Search />
            </Button>
          </div>
          <Button
            className={styles.open_btn}
            onClick={() => setIsOpenHeaderProfile(!isOpenHeaderProfile)}
          >
            {!isOpenHeaderProfile ? "▼" : "▲"}
          </Button>
        </div>

        {isOpenHeaderProfile && (
          <div className={styles.header_profile}>
            {user.photoUrl == "" ? (
              <AccountCircle
                onClick={() => {
                  setIsOpenHeaderProfile(false);
                  setIsInputMode(false);
                  setScreenMode("MyProfile");
                }}
              />
            ) : (
              <></>
            )}
            <p>{user.displayName}</p>
          </div>
        )}
      </header>
      <div className={styles.background}></div>
      <div className={styles.main}>
        {screenMode == "MyProfile" && (
          <>
            {isInputMode ? (
              <>
                {profileMode == "Board" && (
                  <BoardInput
                    triggerSendPost={(func) => {
                      sendPostFunctionRef.current = func;
                    }}
                    toggleInputMode={toggleIsInputModeChange}
                  />
                )}
                {profileMode == "Community" && (
                  <CommunityInput
                    triggerSendPost={(func) => {
                      sendPostFunctionRef.current = func;
                    }}
                    toggleInputMode={toggleIsInputModeChange}
                  />
                )}
              </>
            ) : (
              <MyProfile
                changeMode={handleProfileModeChange}
                setScreenMode={setScreenMode}
                setUidOfProfileMode={setUidOfProfileMode}
                handleChangeAuthUser={props.handleChangeAuthUser}
              />
            )}
          </>
        )}
        {screenMode == "UserProfile" && (
          <UserProfile
            uid={uidOfProfileMode}
            setScreenMode={setScreenMode}
            setUidOfProfileMode={setProfileMode}
          />
        )}
        {screenMode == "Board" && (
          <>
            {isInputMode ? (
              <BoardInput
                triggerSendPost={(func) => {
                  sendPostFunctionRef.current = func;
                }}
                toggleInputMode={toggleIsInputModeChange}
              />
            ) : (
              <Board
                setScreenMode={setScreenMode}
                setUidOfProfileMode={setUidOfProfileMode}
                keyWords={keyWords}
              />
            )}
          </>
        )}
        {screenMode == "Community" && (
          <>
            {isInputMode ? (
              <CommunityInput
                triggerSendPost={(func) => {
                  sendPostFunctionRef.current = func;
                }}
                toggleInputMode={toggleIsInputModeChange}
              />
            ) : (
              <Community
                setScreenMode={setScreenMode}
                setUidOfProfile={setUidOfProfileMode}
                keyWords={keyWords}
              />
            )}
          </>
        )}
        {screenMode == "DM" && (
          <DM
            toggleInputMode={toggleIsInputModeChange}
            isOpenTextForm={isInputMode}
            setIsMessagesMode={setIsMessagesMode}
            triggerSendMessase={(func) => {
              sendPostFunctionRef.current = func;
            }}
          />
        )}
        {screenMode == "Setting" && !isInputMode && (
          <Setting handleChangeAuthUser={props.handleChangeAuthUser} />
        )}
      </div>
      <footer className={styles.footer}>
        <div className={styles.footer_btn_wrapper}>
          <Button
            onClick={() => {
              setScreenMode("Board");
              setIsInputMode(false);
            }}
          >
            <FilterFrames style={{ color: "white" }} />
          </Button>
        </div>
        <div className={styles.footer_btn_wrapper}>
          <Button
            onClick={() => {
              setScreenMode("Community");
              setIsInputMode(false);
            }}
          >
            <Chat style={{ color: "white" }} />
          </Button>
        </div>
        <div className={styles.footer_btn_wrapper_center}>
          <button
            className={isInputMode ? styles.send_btn : styles.add_post_btn}
            onClick={() => {
              screenMode == "DM"
                ? isMessagesMode &&
                  (isInputMode ? handleSendPost() : setIsInputMode(true))
                : isInputMode
                ? handleSendPost()
                : setIsInputMode(true);
            }}
          >
            {!isInputMode ? (
              <>
                <div className={styles.plus_vertical}></div>
                <div className={styles.plus_horizontal}></div>
              </>
            ) : (
              <Send className={styles.send_arrow} />
            )}
          </button>
        </div>
        <div className={styles.footer_btn_wrapper}>
          <Button
            onClick={() => {
              setScreenMode("DM");
              setIsInputMode(false);
            }}
          >
            <Email style={{ color: "white" }} />
          </Button>
        </div>
        <div className={styles.footer_btn_wrapper}>
          <Button
            onClick={() => {
              setScreenMode("Setting");
              setIsInputMode(false);
            }}
          >
            <Settings style={{ color: "white" }} />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Main;
