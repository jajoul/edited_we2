import { Context } from "@/assets/Provider/Provider";
import { useContext, useEffect, useState } from "react";
import ViewHeaders from "../ViewHeaders/ViewHeaders";
import editIcon from "@/assets/images/smallIcons/BlueEdit.svg";
import cameraIcon from "@/assets/images/smallIcons/cameraFill.svg";
import BackgroundHeader from "@/assets/images/BackgroundHeader.png";
import { SET_USER_INFO } from "@/assets/Provider/types";
import { editAvatar, getPersonalQuestions } from "@/assets/Api";
import { toast } from "react-toastify";
import QuestionCard from "./QuestionCard/QuestionCard";
import logo from '@/assets/images/logo.png'

const ProfileView = (props: {
  setView: (viewId: number) => void;
  close: () => void;
  setStep: (step: number) => void;
}) => {
  const { setView, close, setStep } = props;
  const { state, dispatch } = useContext(Context);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getPersonalQuestions().then((res) => {
      if (res.status === 200) setQuestions(res.data?.questions);
    });
  }, []);

  const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        if (typeof reader.result === "string") {
          const newInfo = {
            ...state.userInfo,
            profile: { ...state.userInfo?.profile, avatar: reader.result },
          };
          dispatch({
            type: SET_USER_INFO,
            data: { userInfo: newInfo },
          });
          editAvatar(file).then((res) => {
            if (res.status === 200) {
              toast(`Avatar changed successfully`, {
                type: "success",
              });
            } else {
              toast(`There is an error in update your avatar`, {
                type: "error",
              });
            }
          });
        }
      };
    }
  };

  return (
    <div className="WeTooProfile">
      <img className="WeTooProfile__headerImg" src={BackgroundHeader} />
      <ViewHeaders
        className="WeTooProfile__header"
        goHome={() => setView(1)}
        title="Profile"
        close={close}
      />
      <div className={`WeTooProfile__avatar ${!state.userInfo?.profile.avatar && 'WeTooProfile__avatar--container'}`}>
        <img src={state.userInfo?.profile.avatar || logo} />
        <label
          htmlFor="avatarImageGetter"
          className="WeTooProfile__avatar__changeBtn"
        >
          <img src={cameraIcon} />
        </label>
        <input
          id="avatarImageGetter"
          type="file"
          accept="image/png, image/jpeg"
          className="WeTooProfile__avatar__input"
          onChange={changeAvatar}
        />
      </div>
      <div className="WeTooProfile__name">
        {state.userInfo?.profile.first_name} &nbsp;
        {state.userInfo?.profile.last_name || ""}
      </div>

      <div onClick={() => setStep(1)} className="WeTooProfile__editBtn">
        <img src={editIcon} />
      </div>

      <div className="WeTooProfile__dataBox">
        <div className="WeTooProfile__dataBox__data">
          <label>Email</label>
          <span>{state.userInfo?.user.email}</span>
        </div>
        <div className="WeTooProfile__dataBox__data">
          <label>User name</label>
          <span>{state.userInfo?.user.username}</span>
        </div>
      </div>

      <div className="WeTooProfile__questionTitle">
        Personalized Question
      </div>
      {questions.map((item, index) => (
        <QuestionCard data={item} key={index} />
      ))}
    </div>
  );
};

export default ProfileView;
