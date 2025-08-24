import { createContext, useEffect, useReducer } from "react";
import { Reducer } from "./Reducer";
import {
  Ad,
  CHANGE_IS_LOGIN,
  EN,
  FA,
  Question,
  SET_AD,
  SET_QUESTION,
  SET_TOPICS,
  SET_USER_INFO,
  Topic,
  UserInfo,
} from "./types";
import {
  accessToken,
  advertise,
  followedTopics,
  getAccount,
  getDailyQuestion,
} from "../Api";

export type stateType = {
  lng: "fa" | "en";
  page: null | string;
  isLogin: boolean;
  question: null | Question;
  ads: null | Ad[];
  tags?: { id: number | string; name: string }[];
  topics?: Topic[];
  getUserLoading: boolean;
  userInfo?: UserInfo;
  questionStatus?: {
    selectedItem: { content: string; number: number | string };
  };
};

const initialState: stateType = {
  lng: EN,
  page: null,
  isLogin: localStorage.getItem("isLogin") === "true", //!!accessToken
  question: null,
  ads: null,
  getUserLoading: !!accessToken,
};

interface assets {
  type: string;
  data: any;
}

export const Context = createContext({
  state: initialState,
  dispatch: (arg: assets) => { },
});

const Provider = (props: { children: JSX.Element | JSX.Element[] }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getLanguage = () => {
    if (state.lng === FA)
      document.getElementById("root")?.classList.add("WeTooPersianBody");
    else document.getElementById("root")?.classList.remove("WeTooPersianBody");
  };

  const getQuestion = () => {
    getDailyQuestion().then((res) => {
      if (res.status === 200) {
        dispatch({ type: SET_QUESTION, data: { question: res.data } });
      }
    });
  };

  const getAd = () => {
    advertise().then((res) => {
      if (res.status === 200)
        dispatch({ type: SET_AD, data: { ads: res.data } });
    });
  };

  const getTopics = () => {
    followedTopics().then((res) => {
      if (res.data) dispatch({ type: SET_TOPICS, data: { topics: res.data } });
    });
  };

  const getAccountData = () => {
    if (accessToken)
      getAccount().then((res) => {
        if (res.data) {
          dispatch({ type: CHANGE_IS_LOGIN, data: { isLogin: true } });
          dispatch({ type: SET_USER_INFO, data: { userInfo: res.data } });
        } else {
          localStorage.removeItem("WeTooAccessToken");
          localStorage.removeItem("isLogin");
          dispatch({ type: CHANGE_IS_LOGIN, data: { isLogin: false } });
        }
      });
  };

  useEffect(() => {
    getLanguage();
    getAccountData();
  }, []);

  useEffect(() => {
    if (state.isLogin) {
      getQuestion();
      getAd();
      getTopics();
      if (!state.userInfo) getAccountData();
    }
  }, [state.isLogin]);

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
