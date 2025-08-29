import { useContext, useEffect, useState } from "react";
import "./SignUpForm.less";
import SignUpStepOne from "./Steps/SignUpStepOne";
import "./Steps/SignUpStep.less";
import StepViewer from "./StepViewer/StepViewer";
import { ReactComponent as UKFlag } from "../../assets/images/UKFlag.svg";
import SignUpStepTwo from "./Steps/SignUpStepTwo";
import Title from "@/components/Title/Title";
import SignUpStepThree from "./Steps/SignUpStepThree";
import { getFilesBaseOnLanguages } from "../language/language";
import { Context } from "../../assets/Provider/Provider";

const SignUpForm = () => {
  const weTooSignUpStep = localStorage.getItem("WeTooSignUpStep")
  const [step, setStep] = useState<number>(Number(weTooSignUpStep) || 0);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const weTooUserId = localStorage.getItem("WeTooUserId");
    if (weTooUserId) {
      setUserId(Number(weTooUserId));
    }
  }, []);

  const stepComponents = [
    <SignUpStepOne setStep={setStep} setUserId={setUserId} />,
    <SignUpStepTwo setStep={setStep} userId={userId} />,
    <SignUpStepThree userId={userId} />,
  ];

  const lang = getFilesBaseOnLanguages();

  return (
    <div className="WeTooSignUpForm">
      <div className="WeTooSignUpForm__mobileTopBackground">
        <div className="WeTooSignUpForm__mobileTopBackground__header"></div>
        <div className="WeTooSignUpForm__mobileTopBackground__image"></div>
      </div>
      <UKFlag className="WeTooSignUpForm__flag" />
      <div className="WeTooSignUpForm__body">
        <Title
          className={"WeTooSignUpForm__title WeTooPersianText"}
          title={lang["sign_up"]}
        />
        <div className="WeTooSignUpForm__form">{stepComponents[step]}</div>
        <StepViewer
          className="WeTooSignUpForm__steps"
          selectedStep={step + 1}
          stepNumber={3}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
