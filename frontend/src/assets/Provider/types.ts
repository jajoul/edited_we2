export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const SAVE_CURRENT_PAGE = "SAVE_CURRENT_PAGE";
export const CHANGE_IS_LOGIN = "CHANGE_IS_LOGIN";
export const SET_QUESTION = "SET_QUESTION";
export const SET_AD = "SET_AD";
export const SET_TAGS = "SET_TAGS";
export const SET_TOPICS = "SET_TOPICS";
export const SET_USER_INFO = "SET_USER_INFO";
export const TOGGLE_TOPIC_FOLLOW_LIST = "TOGGLE_TOPIC_FOLLOW_LIST"

/* ----------------------------------------------- */
export const EN = "en";
export const FA = "fa";

/*-------------------------------------------------*/
export type Topic = {
  id: number;
  channel_id: number | string;
  name: string;
  channel_name: string;
  channel_image: string;
  description: string;
  location: null;
  video: null;
  picture: null;
  pdf: null;
  which_type: number;
  likes_count: number;
  comments_count: number;
  tags: { id: number; name: string }[];
  created_at: string;
  updated_at: string;
  comments: Comment[];
  is_editable?:boolean
};

export type Comment = {
  id: number | string;
  profile_image: string;
  profile_name: string;
  score: number;
  content: string;
  reply_counter: number;
  created_at: string;
};

export type Question = {
  opt1_statement: string;
  opt2_statement: string;
  opt3_statement: string;
  opt4_statement: string;
  ques_statement: string;
  id: number | string;
};

export type Ad = {
  image: string;
  url: string;
  id: string;
};

export interface channelData {
  about: string;
  id: string | number;
  title: string;
  image: string;
  which_type: number;
  number_of_members: number;
  is_followed: number
}

export type UserInfo = {
  personal_detail: {
    about: string;
    difficulties: string;
    experiences: string;
    favorites: string;
  };
  profile: {
    avatar: string;
    first_name: string;
    gender: number;
    last_name: string;
  };
  user: {
    created_at: string;
    email: string;
    groups: [];
    id: number | string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_login: null;
    updated_at: string;
    user_permissions: [];
    username: string;
    which_type: number;
  };
};

export type newChannelData = {
  channel?: string;
  name: string;
  description: string;
  tags: (string | number)[];
  which_type?: number; // 0 | 1
  location?: string;
  video?: string;
  picture?: string;
  pdf?: string;
}
