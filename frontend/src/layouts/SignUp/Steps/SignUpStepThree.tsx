import { accessRefreshData, createUserDetail, updateLocalData } from "@/assets/Api";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import Modal from "@/components/Modal/Modal";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import greenTick from "../../../assets/images/greenTick.png";
import Title from "@/components/Title/Title";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";
import { Context } from "@/assets/Provider/Provider";
import { CHANGE_IS_LOGIN } from "@/assets/Provider/types";

const SignUpStepThree = () => {
  const lang = getFilesBaseOnLanguages();

  type keyType = "favorites" | "difficulties" | "experiences" | "about_you";
  const {dispatch} = useContext(Context)

  const [info, setInfo] = useState<{
    [key in keyType]: { value: string; label: string; type: inputType };
  }>({
    favorites: { label: lang["favorite"], value: "", type: inputType.text },
    difficulties: {
      label: lang["difficulties"],
      value: "",
      type: inputType.text,
    },
    experiences: {
      label: lang["experiences"],
      value: "",
      type: inputType.text,
    },
    about_you: {
      label: lang["about_you"],
      value: "",
      type: inputType.text,
    },
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const updateFieldValue = (value: string, key: keyType) => {
    setInfo((pre) => ({ ...pre, [key]: { ...pre[key], value: value } }));
  };

  const goNext = () => {
    let curError = false;
    Object.values(info).forEach((item) => {
      if (item.value.trim().length < 3) curError = true;
    });
    if (curError) {
      setError(true);
    } else {
      setLoading(true);
      createUserDetail(
        info.favorites.value,
        info.difficulties.value,
        info.experiences.value,
        info.about_you.value
      ).then((res) => {
        setLoading(false);
        if (res.status === 201) {
          localStorage.setItem(
            "WeTooAccessToken",
            JSON.stringify(accessRefreshData)
          );
          dispatch({type: CHANGE_IS_LOGIN, data:{isLogin: true}})
          setShowModal(true);
          updateLocalData()
        } else {
          let errorMessage: any = lang["toast_error"];
          if (res.response?.data)
            errorMessage = Object.values(res.response?.data)[0];
          toast(`${errorMessage}`, {
            type: "error",
          });
        }
      });
    }
  };

  return (
    <>
      <div className="SignUpStepThree">
        {Object.entries(info).map(([key, item], index) => (
          <Inputs
            onChange={(value) => updateFieldValue(value, key as keyType)}
            type={item.type}
            value={item.value}
            className="WeTooSignUpStep__input"
            placeholder={item.label}
            label={item.label}
            key={index}
            errorText={
              error && item.value?.trim().length < 3
                ? lang["sign_up_form_step_2_error"]
                : ""
            }
          />
        ))}
        <Buttons
          loading={loading}
          label={lang["next"]}
          theme={buttonTheme.gradient}
          className="WeTooSignUpStep__btn"
          onClick={goNext}
        />
      </div>
      <Modal
        className="SignUpStepThreeModal"
        Close={() => {}}
        content={
          <div className="SignUpStepThreeModal__content">
            <img className="SignUpStepThreeModal__image" src={greenTick} />
            <Title title={lang["congratulations"]} />
            <div className="SignUpStepThreeModal__subTitle WeTooPersianText--center">
              {lang["registration_has_been_successful"]}
            </div>
            <p className="SignUpStepThreeModal__description WeTooPersianText--center">
              {lang["please_continue_to_start_the_application"]}
            </p>
            <Buttons
              className="SignUpStepThreeModal__btn"
              link="/insight-web"
              label={lang["start"]}
              theme={buttonTheme.gradient}
            />
          </div>
        }
        show={showModal}
      />
    </>
  );
};

export default SignUpStepThree;
