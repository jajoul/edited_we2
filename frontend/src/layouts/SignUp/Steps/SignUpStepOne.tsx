import { createUser, updateAccessToken, updateLocalData } from "@/assets/Api";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import SwitchButton from "@/components/SwitchButton/SwitchButton";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "umi";

const SignUpStepOne = (props: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { setStep } = props;
  const lang = getFilesBaseOnLanguages();

  type keyType = "username" | "email" | "password" | "password2";

  const [accept, setAccept] = useState(false);
  const [info, setInfo] = useState<{
    [key in keyType]: {
      value: string;
      label: string;
      type: inputType;
      placeholder?: string;
    };
  }>({
    username: { label: lang["username"], value: "", type: inputType.text },
    email: {
      label: lang["email"],
      value: "",
      type: inputType.email,
      placeholder: "xxxxx@gmail.com",
    },
    password: {
      label: lang["password"],
      value: "",
      type: inputType.password,
      placeholder: "**************",
    },
    password2: {
      label: lang["confirm_password"],
      value: "",
      type: inputType.password,
      placeholder: "**************",
    },
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateFieldValue = (value: string | boolean, key: keyType) => {
    setInfo((pre) => ({ ...pre, [key]: { ...pre[key], value: value } }));
  };

  const goNext = () => {
    console.log("info:", info);
    const errorValue =
      info.username.value.trim().length < 5 ||
      !checkEmail(info.email.value) ||
      !checkPassIsStrong(info.password.value) ||
      info.password.value !== info.password2.value ||
      info.password.value === info.username.value ||
      info.password.value === info.email.value ||
      !accept;
    console.log("errorValue:", errorValue);
    if (errorValue) {
      setError(errorValue);
    } else {
      setError(false);
      setLoading(true);
      createUser(
        info.username.value.trim(),
        info.email.value,
        info.password.value,
        info.password2.value
      ).then((res) => {
        setLoading(false);
        console.log("Registration response:", res);
        if (res?.status === 201) {
          console.log("Registration successful:", res.data);
          // For session authentication, we don't need to store tokens
          // The session cookie is automatically handled by the browser
          props.setUserId(res.data.user_id);
          localStorage.setItem("WeTooUserId", res.data.user_id);
          localStorage.setItem("WeTooSignUpStep", "1");
          setStep((pre) => pre + 1);
        } else {
          let errorMessage: any = lang["toast_error"];
          if (res?.response?.data) {
            const errorData = res.response.data;
            const messages = [];
            for (const key in errorData) {
              const error = errorData[key];
              if (Array.isArray(error)) {
                messages.push(error.join(' '));
              } else {
                messages.push(error);
              }
            }
            if (messages.length > 0) {
              errorMessage = messages.join('\n');
            }
          }

          toast(`${errorMessage}`, {
            type: "error",
          });
        }
      });
    }
  };

  const checkPassIsStrong = (password: string) => {
    const minLength = 8; // Minimum password length
    const hasUppercase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasLowercase = /[a-z]/.test(password); // At least one lowercase letter
    const hasNumber = /[0-9]/.test(password); // At least one digit
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password); // At least one special character

    // Check if the password meets all the criteria
    const isStrong =
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar;
    return isStrong;
  };

  const checkError = (key: string) => {
    if (key === "username" && info.username.value.trim().length < 5)
      return lang["sign_up_username_error"];
    else if (key === "email" && !checkEmail(info.email.value))
      return lang["valid_email"];
    else if (key === "password" && !checkPassIsStrong(info.password.value))
      return lang["sign_up_password_error"];
    else if (
      key === "password2" &&
      info.password.value !== info.password2.value
    )
      return lang["sign_up_confirm_password_error"];
    else if (
      key === "password" &&
      (info.password.value === info.username.value ||
        info.password.value === info.email.value)
    )
      return lang["sign_up_password_similarity_error"];
    return undefined;
  };

  const checkEmail = (email: string) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const terms = [
    { name: lang["Data Collection and Use"], value: lang["term1"] },
    { name: lang["Data Sharing and Disclosure"], value: lang["term2"] },
    { name: lang["User Content and Conduct"], value: lang["term3"] },
    { name: lang["Account Security"], value: lang["term4"] },
    { name: lang["Changes to the Privacy Policy"], value: lang["term5"] },
  ];

  return (
    <div className="WeTooSignUpStepOne">
      {Object.entries(info).map(([key, item], index) => (
        <Inputs
          onChange={(value) => updateFieldValue(value, key as keyType)}
          type={item.type}
          value={item.value}
          className="WeTooSignUpStep__input"
          placeholder={item.placeholder || item.label}
          label={item.label}
          key={index}
          errorText={error ? checkError(key) : undefined}
        />
      ))}

      <div className="WeTooSignUpStepOne__accept">
        <input onChange={(e) => setAccept(e.target.checked)} type="checkbox" />
        {lang["I accept the terms and conditions"]}
      </div>

      <div className="WeTooSignUpStepOne__rules">
        <ul>
          {terms.map((item, index) => (
            <li key={index}>
              <div>{item.name}</div>
              <p>{item.value}</p>
            </li>
          ))}
        </ul>
      </div>

      <Buttons
        loading={loading}
        label={lang["next"]}
        theme={buttonTheme.gradient}
        className="WeTooSignUpStep__btn"
        onClick={goNext}
      />
      <p className="WeTooSignUpStepOne__text WeTooPersianText--center">
        {lang["already_have_an_account?"]}{" "}
        <Link to="/login">{lang["sign_in"]}</Link>{" "}
      </p>
    </div>
  );
};

export default SignUpStepOne;
