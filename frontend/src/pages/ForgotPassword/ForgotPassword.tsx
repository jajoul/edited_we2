// forgot password forms
import { useState } from "react";

import StepOneForm from "../../layouts/ForgotPassword/Steps/StepOneForm";
import StepTwoForm from "../../layouts/ForgotPassword/Steps/StepTwoForm";
import StepThreeForm from "../../layouts/ForgotPassword/Steps/StepThreeForm";

// forgot password cove image
import StepOneCoverImage from "../../assets/images/forgot-password-cover-step1.png";
import StepTwoCoverImage from "../../assets/images/forgot-password-cover-step2.png";
import StepThreeCoverImage from "../../assets/images/forgot-password-cover-step3.png";
// forgot password cover text
import { getFilesBaseOnLanguages } from "../../layouts/language/language";

// other imports
import Title from "@/components/Title/Title";
import PageCover from "@/layouts/PageCover/PageCover";
import { ReactComponent as UKFlag } from "../../assets/images/UKFlag.svg";

// forgot password style
import "./ForgotPassword.less";

const ForgotPassword = () => {
  const [step, setStep] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const lang = getFilesBaseOnLanguages();

  const stepForms = [
    {
      component: <StepOneForm setStep={setStep} setEmail={setEmail} />,
      coverImage: StepOneCoverImage,
      coverText: lang["introduce_we2"],
    },
    {
      component: (
        <StepTwoForm setToken={setToken} setStep={setStep} email={email} />
      ),
      coverImage: StepTwoCoverImage,
      coverText: lang["introduce_we2"],
    },
    {
      component: <StepThreeForm email={email} token={token} />,
      coverImage: StepThreeCoverImage,
      coverText: lang["introduce_we2"],
    },
  ];

  return (
    <div className="WeTooForgotPassword">
      <PageCover
        imageSrc={stepForms[step].coverImage}
        text={stepForms[step].coverText}
        text_className="WeTooPersianText"
        className="WeTooForgotPassword__pageCover"
      />
      <div className="WeTooForgotPassword__formContainer">
        <UKFlag className="WeTooForgotPassword__flag" />
        <Title
          className="WeTooPersianText WeTooForgotPassword__titleColor"
          title={lang["forgot_password"]}
        />

        {stepForms[step].component}
      </div>
    </div>
  );
};

export default ForgotPassword;
