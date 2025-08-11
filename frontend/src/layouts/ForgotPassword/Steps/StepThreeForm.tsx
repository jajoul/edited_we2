import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import { getFilesBaseOnLanguages } from "../../language/language";
import { useState } from "react";

import "./Stepsform.less";
import { forgotPassConfirmNewPass } from "@/assets/Api";
import { history } from "umi";
const StepThreeForm = (props: { email: string; token: string }) => {
  const { email, token } = props;
  const [formFieldState, setFormFieldState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);
  const lang = getFilesBaseOnLanguages();
  const [loading , setLoading] = useState(false)

  const handleForgotPasswordPasswordInput = (key: string, value: string) => {
    setFormFieldState((pre) => ({ ...pre, [key]: value }));
  };

  const inputProps_password = {
    type: inputType.password,
    value: formFieldState.password,
    onChange: (password: string) =>
      handleForgotPasswordPasswordInput("password", password),
    label: lang["new_password"],
    placeholder: "*****",
    className: "WeTooStepThreeForm__inputs ",
    errorText:
      error && formFieldState.password.length < 2
        ? lang["valid_password"]
        : undefined,
  };

  const inputProps_ConfirmPassword = {
    type: inputType.password,
    value: formFieldState.confirmPassword,
    onChange: (confirmPassword: string) =>
      handleForgotPasswordPasswordInput("confirmPassword", confirmPassword),
    label: lang["confirm_new_password"],
    placeholder: "*****",
    className: "WeTooStepThreeForm__inputs ",
    errorText:
      error && formFieldState.password.length < 2
        ? lang["valid_password"]
        : undefined,
  };

  const btnProps_sendCodeBtn = {
    label: lang["forget_pass_step3_btn"],
    theme: buttonTheme.gradient,
    className: "StepThreeForm__formBtn",
    onClick: () => handleUpdatePassword(),
    loading
  };

  const handleUpdatePassword = () => {
    const { password } = formFieldState;
    if (password.length < 2) {
      setError(true);
    } else {
      setLoading(true)
      forgotPassConfirmNewPass(
        email,
        token,
        formFieldState.password,
        formFieldState.confirmPassword
      ).then((res) => {
        setLoading(false)
        history.push('/login')
        // console.log(res);
      });
    }
    // ************************************************************************************************
  };

  return (
    <div className="WeTooStepThreeForm">
      <div className="WeTooStepThreeForm__formTitle">
        <p className="WeTooStepThreeForm__formTitle__title">{lang["enter_password"]}</p>
        <p className="WeTooStepThreeForm__formTitle__subtitle">
         {lang["forget_pass_step3_sub"]}
        </p>
      </div>

      <Inputs {...inputProps_password} />
      <Inputs {...inputProps_ConfirmPassword} />
      <Buttons {...btnProps_sendCodeBtn} />
    </div>
  );
};

export default StepThreeForm;
