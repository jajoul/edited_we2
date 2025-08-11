import { useState } from "react";
import { toast } from "react-toastify";
import { getFilesBaseOnLanguages } from "../../language/language";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import { forgotPasswordCreate } from "@/assets/Api";

import "./Stepsform.less";
const StepOneForm = (props: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { setStep, setEmail } = props
  const [formFieldState, setFormFieldState] = useState({ email: "" });
  const [error, setError] = useState(false);
  const [loading , setLoading] = useState(false)
  const lang = getFilesBaseOnLanguages();

  const handleForgotPasswordEmailInput = (key: string, value: string) => {
    setFormFieldState((pre) => ({ ...pre, [key]: value }));
    setEmail(value)
  };

  const inputProps_email = {
    type: inputType.email,
    value: formFieldState.email,
    onChange: (email: string) => handleForgotPasswordEmailInput("email", email),
    label: lang["email"],
    placeholder: "xxx@gmail.com",
    className: "StepOneForm__inputs ",
    errorText:
      error && formFieldState.email.length < 2
        ? lang["valid_email"]
        : undefined,
  };

  const btnProps_sendCodeBtn = {
    label: lang["forget_pass_step1_btn"],
    theme: buttonTheme.gradient,
    className: "WeTooStepOneForm__formBtn",
    onClick: () => handleLoginForm(),
    loading: loading
  };


  const handleLoginForm = () => {
    const { email } = formFieldState;
    if (email.length < 2) {
      setError(true);
    } else {
      setLoading(true)
      forgotPasswordCreate(formFieldState.email).then((res) => {
        setLoading(false)
        if (res.status === 200) {
          setStep(1)
        }
        // ************************************************************************************************
        else {
          const message = res.response?.data
            ? Object.values(res.response?.data)[0]
            : "There is an error";
          toast(`${message}`, {
            type: "error",
          });
        }
      })

    }
  };


  return (
    <div className="WeTooStepOneForm">
      <div className="WeTooStepOneForm__formTitle">
        <p className="WeTooStepOneForm__formTitle__title">{lang["enter_email"]}</p>
        <p className="WeTooStepOneForm__formTitle__subtitle">
        {lang["forget_pass_step1_sub"]}
        </p>
      </div>

      <Inputs {...inputProps_email} />
      <Buttons {...btnProps_sendCodeBtn} />
    </div>
  );
};

export default StepOneForm;
