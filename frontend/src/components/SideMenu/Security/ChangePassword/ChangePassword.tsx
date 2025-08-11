import { useContext, useState } from "react";
import "./ChangePassword.less";
import ChangePasswordOTP from "./ChangePasswordOTP/ChangePasswordOTP";
import RegetingPassword, {
  passStateType,
} from "./RegetingPassword/RegetingPassword";
import {
  confirmForgotPasswordCode,
  forgotPassConfirmNewPass,
} from "@/assets/Api";
import { Context } from "@/assets/Provider/Provider";
import { toast } from "react-toastify";

const ChangePassword = (props:{close:() => void}) => {
  const { state } = useContext(Context);
  const [step, setStep] = useState(0);
  const [code, setCode] = useState<number | null>(null);
  const [passState, setPassState] = useState<passStateType>({
    pass: "",
    confirmPass: "",
  });
  const [loading, setLoading] = useState(false);

  const confirmReset = () => {
    if (!loading) {
      setLoading(true);
      forgotPassConfirmNewPass(
        state.userInfo?.user.email || "",
        String(code),
        passState.pass,
        passState.confirmPass
      ).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          toast("your password changed successfully", {
            type: "success",
          });
          props.close()
        } else
          toast(`Something is wrong`, {
            type: "error",
          });
      });
    }
  };

  const confirmCodeAndGo = () => {
    if (!loading) {
      setLoading(true);
      confirmForgotPasswordCode(
        state.userInfo?.user.email || "",
        String(code)
      ).then((res) => {
        setLoading(false);
        if (res?.status !== 200)
          toast(`Check your code.`, {
            type: "error",
          });
        else setStep(1);
      });
    }
  };

  const stepsComponent = [
    <ChangePasswordOTP
      code={code}
      setCode={setCode}
      goNext={confirmCodeAndGo}
      loading={loading}
    />,
    <RegetingPassword
      passState={passState}
      setPassState={setPassState}
      goNext={confirmReset}
      loading={loading}
    />,
  ];

  return <div>{stepsComponent[step]}</div>;
};

export default ChangePassword;
