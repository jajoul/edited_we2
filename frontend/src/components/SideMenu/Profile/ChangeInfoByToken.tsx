import {
  editEmail,
  editUsername,
  sendResetEmailToken,
  sendResetUsernameToken,
} from "@/assets/Api";
import { Context } from "@/assets/Provider/Provider";
import { SET_USER_INFO } from "@/assets/Provider/types";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import OTPComponent from "@/components/OTP/OTP";
import Timer from "@/components/Timer/Timer";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChangeInfoByToken = (props: {
  setShowSecondPage: (show: boolean) => void;
  type: string;
  close: () => void;
}) => {
  const { type } = props;
  const [newValue, setNewValue] = useState("");
  const [code, setCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { dispatch, state } = useContext(Context);

  useEffect(() => {
    if (type === "email") sendResetEmailToken();
    else sendResetUsernameToken();
  }, []);

  const handleChange = (codeNum: number) => {
    if (codeNum > 100000) setCode(codeNum);
  };

  const reset = () => {
    if (code && newValue && !loading) {
      setLoading(true);
      let requestInfo;
      if (type === "email") requestInfo = editEmail(newValue, String(code));
      else requestInfo = editUsername(newValue, String(code));
      requestInfo.then((res) => {
        setLoading(false);
        if (res.status === 200) {
          props.close();
          toast(`changed successfully`, {
            type: "success",
          });
          const newInfo = {
            ...state.userInfo,
            user: {
              ...state.userInfo?.user,
              [type === "email" ? "email" : "username"]: newValue,
            },
          };

          dispatch({
            type: SET_USER_INFO,
            data: {
              userInfo: newInfo,
            },
          });
        } else {
          toast(`There is an error `, {
            type: "error",
          });
        }
      });
    }
  };

  return (
    <div className="weTooChangeInfoByToken">
      <div className="weTooChangeInfoByToken__title">Enter the OTP Code</div>
      <p className="weTooChangeInfoByToken__description">
        We have sent an OTP code to your <br /> email for authentication
      </p>
      <OTPComponent
        className="weTooChangeInfoByToken__otp"
        handleChange={handleChange}
      />
      <div style={{ textAlign: 'center', marginBottom: '20px' }}><Timer time={15} /></div>
      <Inputs
        onChange={(v) => setNewValue(v)}
        type={inputType.text}
        value={newValue}
        label={type === "email" ? "Email" : "Username"}
        placeholder={type === "email" ? "Email" : "Username"}
      />
      <Buttons
        className="weTooChangeInfoByToken__btn"
        label={"Confirm"}
        theme={buttonTheme.gradient}
        onClick={reset}
        loading={loading}
      />
    </div>
  );
};

export default ChangeInfoByToken;
