import { useContext, useState } from "react";
import { Link, history } from "umi";

import Inputs, { inputType } from "@/components/Inputs/Inputs";
import Buttons, {
  buttonProps,
  buttonTheme,
} from "@/components/Buttons/Buttons";
import { ReactComponent as GoogleLogo } from "../../assets/images/flat-color-icons_google.svg";

import { getFilesBaseOnLanguages } from "../language/language";
import { loginUser, updateAccessToken, updateLocalData } from "@/assets/Api";
import "./LoginForm.less";
import { toast } from "react-toastify";
import { Context } from "@/assets/Provider/Provider";
import { CHANGE_IS_LOGIN } from "@/assets/Provider/types";

const Form = () => {
  const [formFieldState, setFormFieldState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const lang = getFilesBaseOnLanguages();

  const { dispatch } = useContext(Context);

  const handleFLoginFormFieldChange = (key: string, value: string) => {
    setFormFieldState((pre) => ({ ...pre, [key]: value }));
  };

  const inputProps_email = {
    type: inputType.email,
    value: formFieldState.email,
    onChange: (email: string) => handleFLoginFormFieldChange("email", email),
    label: lang["email"],
    placeholder: "xxx@gmail.com",
    className: "WeTooLoginForm__inputs",
    errorText:
      error && formFieldState.email.length < 2
        ? lang["valid_email"]
        : undefined,
  };

  const inputProps_password = {
    type: inputType.password,
    value: formFieldState.password,
    onChange: (password: string) =>
      handleFLoginFormFieldChange("password", password),
    label: lang["password"],
    placeholder: "*********",
    className: "WeTooLoginForm__inputs",
    errorText:
      error && formFieldState.email.length < 2
        ? lang["valid_password"]
        : undefined,
  };

  const btnProps_emailLoginBtn: buttonProps = {
    label: lang["sign_in"],
    theme: buttonTheme.gradient,
    className: "WeTooLoginForm__emailLoginBtn",
    onClick: () => handleLoginForm(),
    loading: loading,
  };

  const handleLoginForm = () => {
    const { email, password } = formFieldState;
    if (email.length < 2 || password.length < 2) {
      setError(true);
    } else if (!loading) {
      setLoading(true);
      loginUser(email, password).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          const data = res.data;
          localStorage.setItem("WeTooAccessToken", JSON.stringify(data));
          updateLocalData()
          dispatch({ type: CHANGE_IS_LOGIN, data: { isLogin: true } });
          if (data.destination === 0) {
            history.push("/insight-web");
          }
          else {
            localStorage.setItem("WeTooSignUpStep", JSON.stringify(2 - Number(data.destination)));
            history.push("/signup");
          }

        } else {
          const message = res.response?.data
            ? Object.values(res.response?.data)[0]
            : "There is an error";
          toast(`${message}`, {
            type: "error",
          });
        }
      });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="WeTooLoginForm"
    >
      <Inputs {...inputProps_email} />
      <Inputs {...inputProps_password} />

      <Link to="/forgot-pass" className="WeTooLoginForm__forgotPassword">
        {lang["forgot_password"]}
      </Link>

      <Buttons {...btnProps_emailLoginBtn} />

      <div className="WeTooLoginForm__loginDivider">
        {lang["or_continue_with"]}
      </div>

      <Link to="/">
        <button className="WeTooLoginForm__googleLoginBtn">
          <GoogleLogo className="WeTooLoginForm__googleLoginBtn__logo" />
          <span className="WeTooLoginForm__googleLoginBtn__label">Google</span>
        </button>
      </Link>

      <p className="WeTooLoginForm__signUpLink">
        {lang["no_account_yet"]} &nbsp;
        <Link to="/signup" className="WeTooLoginForm__signUpLink__link">
          {lang["sign_up"]}
        </Link>
      </p>
    </form>
  );
};

export default Form;
