import OTPComponent from "@/components/OTP/OTP";
import "./ChangePasswordOTP.less";
import pana from "@/assets/images/pana.png";
import { useContext, useEffect, useState } from "react";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Timer from "@/components/Timer/Timer";
import { forgotPasswordCreate } from "@/assets/Api";
import { Context } from "@/assets/Provider/Provider";

const ChangePasswordOTP = (props: {
  goNext?: () => void;
  code: number | null;
  setCode: (num: number) => void;
  loading: boolean
}) => {
  const { code, setCode, loading } = props;
  // const [code, setCode] = useState<number | null>(null);
  const { state } = useContext(Context);

  const handleChange = (codeNum: number) => {
    if (codeNum > 100000) setCode(codeNum);
  };

  const { goNext } = props;

  useEffect(() => {
    forgotPasswordCreate(state.userInfo?.user.email || "");
  }, []);

  return (
    <div className="weTooChangePasswordOTP">
      <img src={pana} />
      <p className="weTooChangePasswordOTP__title">Enter the OTP Code</p>
      <p className="weTooChangePasswordOTP__description">
        We have sent an OTP code to your <br /> email for authentication
      </p>
      <OTPComponent
        className="weTooChangePasswordOTP__otpComponent"
        handleChange={handleChange}
      />

      {code ? (
        <Buttons
          className="weTooChangePasswordOTP__btn"
          onClick={goNext}
          label={"Next"}
          theme={buttonTheme.gradient}
          loading={loading}
        />
      ) : (
        <Timer time={5} />
      )}
    </div>
  );
};

export default ChangePasswordOTP;
