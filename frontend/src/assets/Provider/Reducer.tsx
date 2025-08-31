import { stateType } from "./Provider";
import {
  CHANGE_IS_LOGIN,
  CHANGE_LANGUAGE,
  FA,
  SAVE_CURRENT_PAGE,
  SET_AD,
  SET_QUESTION,
  SET_TAGS,
  SET_TOPICS,
  SET_USER_INFO,
  TOGGLE_TOPIC_FOLLOW_LIST,
} from "./types";

export const Reducer = (
  state: stateType,
  action: { type: string; data: any }
) => {
  switch (action.type) {
    case CHANGE_LANGUAGE: // add action type here
      if (action.data.lng === FA)
        document.getElementById("root")?.classList.add("WeTooPersianBody");
      else
        document.getElementById("root")?.classList.remove("WeTooPersianBody");
      // Persist language selection to localStorage
      localStorage.setItem("WeTooLanguage", action.data.lng);
      return {
        ...state,
        lng: action.data.lng,
      };
    case SAVE_CURRENT_PAGE:
      return { ...state, page: action.data.page };
    case CHANGE_IS_LOGIN:
      return { ...state, isLogin: action.data.isLogin, getUserLoading: false };
    case SET_QUESTION:
      return { ...state, question: action.data.question };
    case SET_AD:
      return { ...state, ads: action.data.ads };
    case SET_TAGS:
      return { ...state, tags: action.data.tags };
    case SET_TOPICS:
      return { ...state, topics: action.data.topics };
    case SET_USER_INFO:
      return { ...state, userInfo: action.data.userInfo };
    
    case TOGGLE_TOPIC_FOLLOW_LIST: //{follow:boolean , topics:[], channel_id:string}
      if (action.data.follow && action.data.topics) {
        //Add follow
        const newList = [...(state.topics || []), ...action.data.topics ];
        return { ...state, topics: newList };
      } else if (!action.data.follow && action.data.channel_id) {
        //Remove follow
        const newList = state.topics?.filter(
          (item) => String(item.channel_id) !== String(action.data.channel_id)
        );
        return { ...state, topics: newList };
      }
      return state;

    default:
      return state;
  }
};
