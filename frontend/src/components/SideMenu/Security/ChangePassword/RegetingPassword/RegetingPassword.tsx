import Inputs, { inputType } from "@/components/Inputs/Inputs";
import "./RegetingPassword.less";
import regettingImage from "@/assets/images/regettingPass.png";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";

export type passStateType = { pass: ""; confirmPass: "" };

const RegetingPassword = (props: {
  goNext: () => void;
  passState: passStateType;
  setPassState: (state: passStateType) => void;
  loading:boolean
}) => {
  const {goNext, passState, setPassState, loading} = props

  const changePass = (value:string , key:string) => {
    const newState = {...passState, [key]: value}
    setPassState(newState)
  }

  return (
    <div className="weTooRegetingPassword">
      <img className="weTooRegetingPassword__image" src={regettingImage} />
      <p className="weTooRegetingPassword__title">Enter Password</p>
      <p className="weTooRegetingPassword__description">
        Use the new password to reset your account
      </p>
      <Inputs
        onChange={(v) => changePass(v,'pass')}
        type={inputType.password}
        value={passState.pass}
        className="weTooRegetingPassword__input"
        errorText=""
        label="New password"
        placeholder="*********"
      />
      <Inputs
        onChange={(v) => changePass(v,'confirmPass')}
        type={inputType.password}
        value={passState.confirmPass}
        className="weTooRegetingPassword__input"
        errorText=""
        label="Confirm New Password"
        placeholder="*********"
      />
      <Buttons
        label={"Update"}
        theme={buttonTheme.gradient}
        className="weTooRegetingPassword__btn"
        onClick={goNext}
        loading={loading}
      />
    </div>
  );
};

export default RegetingPassword;
