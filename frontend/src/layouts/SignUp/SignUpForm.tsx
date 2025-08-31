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
  const { state } = useContext(Context);
  
  // Check if user is already logged in - if so, they shouldn't be in registration
  useEffect(() => {
    if (state.isLogin) {
      // Clear any incomplete registration data
      localStorage.removeItem("WeTooSignUpStep");
      localStorage.removeItem("WeTooUserId");
      // Redirect to home or dashboard
      window.location.href = "/insight-web";
    }
  }, [state.isLogin]);

  // Get registration step from localStorage
  const weTooSignUpStep = localStorage.getItem("WeTooSignUpStep");
  const weTooUserId = localStorage.getItem("WeTooUserId");
  
  // Determine initial step: if user has started but not completed registration, start from step 1
  const getInitialStep = () => {
    // If no step stored, start from step 1
    if (!weTooSignUpStep) return 0;
    
    const step = Number(weTooSignUpStep);
    // If step is 2 or higher but no user ID, something went wrong - reset to step 1
    if (step >= 1 && !weTooUserId) {
      localStorage.removeItem("WeTooSignUpStep");
      return 0;
    }
    
    // If step is 3, registration is complete - clear data and start from step 1
    if (step >= 3) {
      localStorage.removeItem("WeTooSignUpStep");
      localStorage.removeItem("WeTooUserId");
      return 0;
    }
    
    return step;
  };

  // Validate and reset incomplete registration data
  const validateRegistrationData = () => {
    const step = Number(weTooSignUpStep);
    const userId = weTooUserId;
    
    console.log("Validating registration data:", { step, userId, weTooSignUpStep, weTooUserId });
    
    // If we have a step but no user ID, or step is invalid, reset everything
    if ((step >= 1 && !userId) || step < 0 || step > 3) {
      console.log("Invalid registration data detected, resetting to step 0");
      localStorage.removeItem("WeTooSignUpStep");
      localStorage.removeItem("WeTooUserId");
      return 0;
    }
    
    // If step is 3, registration is complete - clear data and start from step 1
    if (step >= 3) {
      console.log("Registration completed, clearing data and starting fresh");
      localStorage.removeItem("WeTooSignUpStep");
      localStorage.removeItem("WeTooUserId");
      return 0;
    }
    
    // If user has started registration but not completed it, reset to step 1
    // This ensures users always start from the beginning if they leave mid-registration
    if (step >= 1) {
      console.log("Incomplete registration detected, clearing data and starting from step 1");
      localStorage.removeItem("WeTooSignUpStep");
      localStorage.removeItem("WeTooUserId");
      return 0;
    }
    
    // If we have a userId but no step, clear the userId and start fresh
    if (!step && userId) {
      console.log("UserId found but no step, clearing data and starting fresh");
      localStorage.removeItem("WeTooUserId");
      return 0;
    }
    
    console.log("Registration data is valid, starting at step:", step);
    return step;
  };

  const [step, setStep] = useState<number>(validateRegistrationData());
  const [userId, setUserId] = useState<number | null>(weTooUserId ? Number(weTooUserId) : null);

  useEffect(() => {
    const weTooUserId = localStorage.getItem("WeTooUserId");
    if (weTooUserId) {
      setUserId(Number(weTooUserId));
    }
  }, []);

  // Clear any orphaned registration data on mount
  useEffect(() => {
    const weTooSignUpStep = localStorage.getItem("WeTooSignUpStep");
    const weTooUserId = localStorage.getItem("WeTooUserId");
    
    // If we have a userId but no step, or if step is invalid, clear everything
    if ((weTooUserId && !weTooSignUpStep) || (weTooSignUpStep && Number(weTooSignUpStep) >= 3)) {
      console.log("Clearing orphaned registration data on mount");
      localStorage.removeItem("WeTooSignUpStep");
      localStorage.removeItem("WeTooUserId");
    }
  }, []);

  // Cleanup function to clear registration data when registration is completed
  const clearRegistrationData = () => {
    localStorage.removeItem("WeTooSignUpStep");
    localStorage.removeItem("WeTooUserId");
  };

  // Cleanup on component unmount or when user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear incomplete registration data when user leaves the page
      if (!state.isLogin) {
        clearRegistrationData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also clear data when component unmounts (user navigates away)
      if (!state.isLogin) {
        clearRegistrationData();
      }
    };
  }, [state.isLogin]);

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
