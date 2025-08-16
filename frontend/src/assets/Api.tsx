import axios from "axios";
import { logout } from "./functions";
import { newChannelData } from "./Provider/types";

export const base_url = `https://social.me2we2.com/api/`;

function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let localStorageData = localStorage.getItem("WeTooAccessToken");
let userDataObject = localStorageData ? JSON.parse(localStorageData) : {};
export let accessToken = userDataObject?.access;

let defaultApi = axios.create({
  baseURL: base_url,
  withCredentials: true, // This enables sending cookies with requests
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined
  },
});

let user: { access?: string; refresh?: string } = {};
let counter = 0;
let isAlreadyFetchingAccessToken = false;
export let accessRefreshData: { access: string } | null = null;

export const updateAccessToken = (acc: { access: string, refresh: string }) => {
  console.log("updateAccessToken called with:", acc);
  if (acc && acc.access) {
    accessRefreshData = acc;
    user = acc;
    localStorage.setItem("WeTooAccessToken", JSON.stringify(acc));
    console.log("Tokens stored in localStorage and user variable");
  } else {
    console.log("No access token provided to updateAccessToken");
  }
};

export const updateLocalData = () => {
  localStorageData = localStorage.getItem("WeTooAccessToken");
  userDataObject = localStorageData ? JSON.parse(localStorageData) : {};
  accessToken = userDataObject?.access;
  // Also update the global user variable that the interceptor uses
  user = userDataObject;
};

defaultApi.interceptors.request.use((config) => {
  // For session authentication, we don't need to set any headers
  // The session cookie will be sent automatically with withCredentials: true

  // Add CSRF token for non-GET requests
  if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }

  return config;
});

defaultApi.interceptors.response.use(
  function (response) {
    counter = 0;
    return response;
  },
  function (error) {
    const { config, response } = error;
    const originalRequest = config;
    if (
      (response?.status === 401 || response?.status === 403) &&
      counter <= 5 &&
      !config.url.includes(`token/refresh`)
    ) {
      counter++;
      if (!isAlreadyFetchingAccessToken && user?.refresh) {
        isAlreadyFetchingAccessToken = true;
        generate_refresh_token(user.refresh).then((data) => {
          isAlreadyFetchingAccessToken = false;
          if (data?.data?.access) {
            user = {
              access: data?.data?.access,
              refresh: user.refresh,
            };
            localStorage.setItem("WeTooAccessToken", JSON.stringify(user));
          } else {
            logout();
          }
        });
      }

      return new Promise((resolve) => {
        if (user && !!user.access) {
          originalRequest.headers["Authorization"] = "Bearer " + user.access;
        }
        resolve(defaultApi(originalRequest));
      });
    } else return Promise.reject(error);
  }
);

export const generate_refresh_token = (refresh: string) => {
  return defaultApi({
    method: "post",
    url: `token/refresh/`,
    data: {
      refresh,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const createUser = (
  username: string,
  email: string,
  password: string,
  password2: string
) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/user/create/`,
    data: {
      username,
      email,
      password,
      password2,
    },
    headers: {
      Authorization: undefined // Explicitly remove auth header for registration
    }
  })
    .then((res: any) => {
      if (res.data.access) {
        updateAccessToken(res.data);
        // Update default headers after getting new token
        defaultApi.defaults.headers.Authorization = `Bearer ${res.data.access}`;
      }
      return res;
    })
    .catch((err: any) => err);
};

export const createProfile = (
  user_id: number,
  first_name: string,
  last_name: string,
  gender: number,
  avatar?: string
) => {
  var bodyFormData = new FormData();
  bodyFormData.append("user_id", `${user_id}`);
  bodyFormData.append("first_name", first_name);
  bodyFormData.append("last_name", last_name);
  bodyFormData.append("gender", `${gender}`);
  if (avatar) {
    bodyFormData.append("avatar", avatar);
  }
  
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/profile/create/`,
    data: bodyFormData,
    headers:{
      Authorization: undefined
    }
  })
    .then((res: any) => res)
    .catch((err: any) => err);
};

export const createUserDetail = (
  favorites: string,
  difficulties: string,
  experiences: string,
  about: string,
  user_id: number | null
) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/user-detail/create/`,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined
    },
    data: {
      favorites,
      difficulties,
      experiences,
      about,
      user_id,
    },
  })
    .then((res: any) => res)
    .catch((err: any) => err);
};

export const loginUser = (email: string, password: string) => {
  return defaultApi({
    method: "post",
    url: `token/`,
    data: {
      email,
      password,
    },
  })
    .then((res: any) => {
      if (res.data.access) {
        updateAccessToken(res.data);
      }
      return res;
    })
    .catch((err: any) => err);
};

export const forgotPasswordCreate = (email: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/forget-password/`,
    data: {
      email,
    },
  })
    .then((res: any) => res)
    .catch((err: any) => err);
};

export const confirmForgotPasswordCode = (email: string, token: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/forget-password/token/`,
    data: {
      email,
      token,
    },
  })
    .then((res: any) => res)
    .catch((err: any) => err);
};

export const forgotPassConfirmNewPass = (
  email: string,
  token: string,
  password1: string,
  password2: string
) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/forget-password/change/`,
    data: {
      email,
      token,
      password1,
      password2,
    },
  })
    .then((res: any) => res)
    .catch((err: any) => err);
};

export const getChannelsList = () => {
  return defaultApi({
    method: "get",
  url: `${base_url}website/v1/channels/channel/`,
  })
    .then((res) => res)
    .catch((error) => error);
};

export const getChannel = (id: string) => {
  return defaultApi({
    method: "get",
  url: `website/v1/channels/channel/${id}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const createChannel = (data: {
  title: string;
  about: string;
  image?: any;
  which_type: number; // 0=simple user,1 = admin
}) => {
  var bodyFormData = new FormData();
  bodyFormData.append("title", data.title);
  bodyFormData.append("about", data.about);
  bodyFormData.append("which_type", `${data.which_type}`);
  if (data.image) {
    bodyFormData.append("image", data.image);
  }

  return defaultApi({
    method: "post",
  url: `website/v1/channels/channel/`,
    data: bodyFormData,
    headers: {
      "Content-Type": " multipart/form-data",
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const updateChannel = (
  data: {
    title: string;
    about: string;
    image?: any;
    which_type: number;
  },
  id: string
) => {
  var bodyFormData = new FormData();
  bodyFormData.append("title", data.title);
  bodyFormData.append("about", data.about);
  bodyFormData.append("which_type", `${data.which_type}`);
  if (data.image) {
    bodyFormData.append("image", data.image);
  }

  return defaultApi({
    method: "patch",
  url: `website/v1/channels/channel/${id}/`,
    data: bodyFormData,
    headers: {
      "Content-Type": " multipart/form-data",
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const deleteChannel = (id: string) => {
  return defaultApi({
    method: "delete",
  url: `website/v1/channels/channel/${id}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getDailyQuestion = () => {
  return defaultApi({
    method: "get",
  url: `website/v1/daily_questions/question`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const answerDailyQuestion = (data: {
  content: string;
  question_id: string | number;
  which_option: string | number;
}) => {
  return defaultApi({
    method: "post",
  url: `website/v1/daily_questions/answer/`,
    data: {
      content: data.content,
      question_id: data.question_id,
      which_option: data.which_option,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const advertise = () => {
  return defaultApi({
    method: "get",
  url: `website/v1/site_behavior/advertisement/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const createEditTopic = (
  data: newChannelData,
  edit?: boolean,
  id?: string
) => {
  var bodyFormData = new FormData();
  if (!!data.picture) bodyFormData.append("picture", data.picture);
  else data.picture = undefined;

  if (!!data.pdf) bodyFormData.append("pdf", data.pdf);
  else data.pdf = undefined;

  if (!!data.video) bodyFormData.append("video", data.video);
  else data.video = undefined;

  return defaultApi({
    method: edit ? "patch" : "post",
  url: `website/v1/site_behavior/topic/${id ? id + "/" : ""}`,
    data: {
      ...data,
      tags: data.tags.join(","),
      ...bodyFormData,
    },
    headers: {
      "Content-Type": " multipart/form-data",
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const chanelTopicList = (id: string) => {
  return defaultApi({
    method: "get",
  url: `website/v1/site_behavior/topic/channel/${id}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const deleteImage = (id:string) => {
  return defaultApi({
    method: "post",
  url: `website/v1/site_behavior/topic/remove/image/${id}`,
  })
    .then((res) => res)
    .catch((err) => err);
}

export const deleteVideo = (id:string) => {
  return defaultApi({
    method: "post",
  url: `website/v1/site_behavior/topic/remove/video/${id}`,
  })
    .then((res) => res)
    .catch((err) => err);
}

export const deletePDF = (id:string) => {
  return defaultApi({
    method: "post",
  url: `website/v1/site_behavior/topic/remove/pdf/${id}`,
  })
    .then((res) => res)
    .catch((err) => err);
}

export const followedTopics = (limit?: number | string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/list/followed/${
      limit ? "?limit=" + limit : ""
    }`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const newestTopicsList = (limit?: number) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/list/newest/${
      limit ? "?limit=" + limit : ""
    }`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const allTopics = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const topTopics = (limit?: number) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/list/top/${
      limit ? "?limit=" + limit : ""
    }`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const recommendedTopics = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/list/recommended/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getTopicById = (id: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/${id}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getTags = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/tags/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getAccount = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/accounts/user/full-info/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const trendTags = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/tags/trend/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const sendTopicComment = (
  topicId: string,
  score: number,
  content: string
) => {
  return defaultApi({
    method: "post",
    url: `website/v1/site_behavior/comments/topic/${topicId}/`,
    data: {
      score,
      content,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getTopicComments = (topicId: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/comments/topic/${topicId}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const toggleTopicLike = (topicId: string, like: boolean) => {
  return defaultApi({
    method: like ? "post" : "delete",
    url: `website/v1/site_behavior/like/${topicId}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getTopicLike = (topicId: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/like/${topicId}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const searchTopics = (search: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/search/topic/?q=${search}`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const searchChannels = (search: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/search/channel/?q=${search}`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const replyComment = (
  commentId: string,
  content: string,
  score: number
) => {
  return defaultApi({
    method: "post",
    url: `website/v1/site_behavior/comments/reply/${commentId}/`,
    data: {
      content,
      score,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getCommentReplies = (commentId: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/comments/reply/${commentId}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const followChannel = (id: string, follow: boolean) => {
  return defaultApi({
    method: follow ? "post" : "delete",
  url: `${base_url}website/v1/channels/channel/${id}/follow`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const filterTopicsByTag = (id: string) => {
  return defaultApi({
    method: "get",
    url: `website/v1/site_behavior/topic/list/by-tag/${id}/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const myChannels = () => {
  return defaultApi({
    method: "get",
  url: `${base_url}website/v1/channels/channel/list/owner`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const lastActivity = (limit?: number) => {
  return defaultApi({
    method: "get",
    url: `website/v1/my_world/last-activities/${
      limit ? "?limit=" + limit : ""
    }`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const followingChannels = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/my_world/following/channels/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const commentedChannels = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/my_world/commented/topics/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const likedChannels = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/my_world/liked/topics`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const editProfile = (
  show_name_in_chat: boolean,
  first_name: string,
  last_name: string,
  gender: number
) => {
  return defaultApi({
    method: "patch",
    url: `website/v1/accounts/setting/edit/profile/`,
    data: {
      show_name_in_chat,
      first_name,
      last_name,
      gender,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const editAvatar = (avatar: File) => {
  const myFormData = new FormData();
  myFormData.append("avatar", avatar);

  return defaultApi({
    method: "patch",
    url: `website/v1/accounts/setting/edit/profile/avatar/`,
    data: myFormData,
    headers: {
      "Content-Type": " multipart/form-data",
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const sendResetEmailToken = () => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/setting/edit/email/send_email/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const sendResetUsernameToken = () => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/setting/edit/username/send_email/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const editEmail = (email: string, token: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/setting/edit/email/`,
    data: {
      token,
      email,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const editUsername = (username: string, token: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/accounts/setting/edit/username/`,
    data: {
      token,
      username,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getPersonalQuestions = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/accounts/setting/profile`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const createLive = (title: string, description: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/init/`,
    data: {
      title,
      description,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const createProduceTransport = (room_id: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/producer/create/`,
    data: {
      room_id,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const connectTransport = (dtls_parameter: any) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/producer/connect/`,
    data: {
      dtls_parameter,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

// ************************************************************************************************
export const createConsumerTransport = () => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/consumer/create/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const connectConsumer = () => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/consumer/connect/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const resumeConsume = () => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/consumer/resume/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const produceTransport = (kind: any, rtp_parameters: any) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/producer/produce/`,
    data: {
      kind,
      rtp_parameters,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const scheduleMeet = (
  title: string,
  description: string,
  date: string,
  cover: File
) => {
  var bodyFormData = new FormData();
  bodyFormData.append("cover", cover);
  bodyFormData.append("title", title);
  bodyFormData.append("description", description);
  bodyFormData.append("date", date);

  return defaultApi({
    method: "post",
    url: `website/v1/live/scheduled/`,
    data: bodyFormData,
    headers: {
      "Content-Type": " multipart/form-data",
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const uploadVideoRequest = (
  title: string,
  description: string,
  video: File,
  cover: File
) => {
  var bodyFormData = new FormData();
  bodyFormData.append("cover", cover);
  bodyFormData.append("video", video);
  bodyFormData.append("title", title);
  bodyFormData.append("description", description);
  return defaultApi({
    method: "post",
    url: `website/v1/live/upload/`,
    data: bodyFormData,
    headers: {
      "Content-Type": " multipart/form-data",
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const createMeet = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/my_world/create-meet/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const endLive = (room_id: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/end/`,
    data: {
      room_id: room_id,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const startLive = (room_id: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/start/`,
    data: {
      room_id: room_id,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const addMember = (room_id: string) => {
  return defaultApi({
    method: "post",
    url: `website/v1/live/add-member/`,
    data: {
      room_id: room_id,
    },
  })
    .then((res) => res)
    .catch((err) => err);
};

export const getScheduleList = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/live/scheduled/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const uploadedList = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/live/upload/`,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const onlineLives = () => {
  return defaultApi({
    method: "get",
    url: `website/v1/live/online-lives/`,
  })
    .then((res) => res)
    .catch((err) => err);
};
