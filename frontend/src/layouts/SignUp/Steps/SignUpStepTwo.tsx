import { createProfile } from "@/assets/Api";
import Buttons from "@/components/Buttons/Buttons";
import { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs from "@/components/Inputs/Inputs";
import { inputType } from "@/components/Inputs/Inputs";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface SignUpStepTwoProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  userId: number | null;
}

const SignUpStepTwo = (props: SignUpStepTwoProps) => {
  const lang = getFilesBaseOnLanguages();

  const { setStep } = props;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState<{
    avatar?: { base64: any; file: any };
    first_name: string;
    last_name: string;
    gender: number;
  }>({
    avatar: undefined,
    first_name: "",
    last_name: "",
    gender: 0,
  });

  const getAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        if (typeof reader.result === "string")
          setInfo((pre) => ({
            ...pre,
            avatar: { base64: reader.result, file },
          }));
      };
    }
  };

  const changeInfo = (value: string | number, label: string) => {
    setInfo((pre) => ({ ...pre, [label]: value }));
  };

  const genders = [
    { name: lang["male"], value: 0, id: "male" },
    { name: lang["female"], value: 1, id: "female" },
    { name: lang["I_don't_want_to_say"], value: 2, id: "unknown" },
  ];

  const goNext = () => {
    if (!props.userId) {
      setError(true);
      toast("User ID is missing. Please complete step 1 again.", { type: "error" });
      console.error("User ID is missing in SignUpStepTwo. Props:", props);
      return;
    }
    if (info.first_name.trim().length > 1 && info.last_name.trim().length > 1) {
      setLoading(true);
      console.log("User ID being sent:", props.userId);
      createProfile(
        props.userId,
        info.first_name,
        info.last_name,
        info.gender,
        info.avatar?.file
      ).then((res) => {
        setLoading(false);
        if (res?.status === 201) {
          setStep((pre) => pre + 1);
        } else {
          let errorMessage: any = lang;
          if (res.response?.data)
            errorMessage = Object.values(res.response?.data)[0];
          toast(`${errorMessage}`, {
            type: "error",
          });
        }
      });
    } else {
      setError(true);
    }
  };

  return (
    <div className="WeTooSignUpStepTwo">
      <div className="WeTooSubTitle WeTooPersianText">
        {lang["profile_picture"]}
      </div>
      <div className="WeTooSignUpStepTwo__imagePicker">
        <label htmlFor="WeTooProfilePicture">
          {info.avatar && <img src={info.avatar?.base64} />}
        </label>
        <input
          id="WeTooProfilePicture"
          type="file"
          accept="image/png, image/jpeg"
          onChange={getAvatar}
        />
      </div>

      <Inputs
        onChange={(value) => changeInfo(value, "first_name")}
        type={inputType.text}
        value={info.first_name}
        label={lang["first_name"]}
        className="WeTooSignUpStepTwo__input"
        placeholder={lang["first_name"]}
        errorText={
          error && info.first_name.trim().length < 2
            ? lang["sign_up_first_name_error"]
            : undefined
        }
      />
      <Inputs
        placeholder={lang["last_name"]}
        onChange={(value) => changeInfo(value, "last_name")}
        type={inputType.text}
        label={lang["last_name"]}
        value={info.last_name}
        errorText={
          error && info.last_name.trim().length < 2
            ? lang["sign_up_last_name_error"]
            : undefined
        }
      />

      <div className="WeTooSubTitle WeTooSignUpStepTwo__subTitle WeTooPersianText">
        {lang["gender"]}
      </div>

      <div className="WeTooSignUpStepTwo__selectionList">
        {genders.map((item, index) => (
          <React.Fragment key={index}>
            <input
              onChange={(e) => changeInfo(Number(e.target.value), "gender")}
              type="radio"
              id={item.id}
              name="Gender"
              value={item.value}
            />
            <label
              htmlFor={item.id}
              className={`WeTooPersianText WeTooSignUpStepTwo__selectionList__label ${
                item.value === info.gender &&
                "WeTooSignUpStepTwo__selectionList__label--active"
              }`}
            >
              {item.name}
            </label>
          </React.Fragment>
        ))}
      </div>
      <Buttons
        loading={loading}
        label={lang["next"]}
        theme={buttonTheme.gradient}
        className="WeTooSignUpStep__btn"
        onClick={goNext}
      />
    </div>
  );
};

export default SignUpStepTwo;
