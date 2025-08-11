import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import { getFilesBaseOnLanguages } from "../../../layouts/language/language";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import "./Stepsform.less";
import { confirmForgotPasswordCode, forgotPasswordCreate } from "@/assets/Api";

const StepTwoForm = (props: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setToken:(token:string) => void;
  email: string;
}) => {
  const { setStep, email, setToken } = props;
  const [otp, setOtp] = useState([NaN, NaN, NaN, NaN, NaN, NaN]);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(20);
  const [resend, setResend] = useState(false);

  const lang = getFilesBaseOnLanguages();

  // countdown =====================================
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setResend(true);
    }
  }, [timer]);

  // otp handler ==================================
  const otpCodeHandler = (otpValue: string, index: number) => {
    if (otpValue?.length > 0) setActive(index + 1);

    const newOtp = [...otp];
    newOtp[index] = Number(otpValue[otpValue.length - 1]);
    setOtp(newOtp);
    if (String(newOtp).length === 11) {
      // check the OTP code -- API
      const my_opt = newOtp.join("");
      confirmForgotPasswordCode(email, my_opt).then((res) => {
        if (res.data) {
          setToken(my_opt)
          setStep(2);
        } else {
          setResend(true);
          setError("wrong OTP! try again");
        }
      });
    }
  };

  const handleResendClick = () => {
    setTimer(20);
    setResend(false);
    setOtp([NaN, NaN, NaN, NaN, NaN, NaN]);
    forgotPasswordCreate(email).then((res) => {
      toast('new token sended successfully', {
        type: "info",
      });
    });
  };

  // props  =======================================
  const inputProps_otp = {
    type: inputType.number,
    label: "",
    placeholder: "",
    className: "WeTooStepTwoForm__otpContainer__inputMap__otpInput",
  };

  return (
    <div className="WeTooStepTwoForm">
      <div className="WeTooStepTwoForm__formTitle">
        <p className="WeTooStepTwoForm__formTitle__title">
          {lang["enter_opt"]}
        </p>
        <p className="WeTooStepTwoForm__formTitle__subtitle">
          {lang["forget_pass_step2_sub"]}
        </p>
      </div>

      <div className="WeTooStepTwoForm__otpContainer">
        {otp.map((otpCell, index: number) => (
          <div key={index} className="WeTooStepTwoForm__otpContainer__inputMap">
            <Inputs
              {...inputProps_otp}
              value={otpCell}
              onChange={(otp: string) => otpCodeHandler(otp, index)}
              onFocus={() => setActive(index)}
              focus={active === index}
            />
          </div>
        ))}
      </div>

      {/* timer */}
      <div className="WeTooStepTwoForm__countdown">
        00:{timer.toString().padStart(2, "0")}
      </div>

      {/* resend text and link */}
      {resend && (
        <p className="WeTooStepTwoForm__resendText">
          Haven't received the email yet?
          <span
            className="WeTooStepTwoForm__resendText__link"
            onClick={handleResendClick}
          >
            {" "}
            Resend
          </span>
        </p>
      )}

      {/* btn to next step */}
      {/* {otpCorrect && (
        <Buttons {...btnProps_sendCodeBtn} />
      )} */}
    </div>
  );
};

export default StepTwoForm;
