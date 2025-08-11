import { useState } from "react";
import "./Profile.less";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

const Profile = (props: {
  setView: (viewId: number) => void;
  close: () => void;
}) => {
  const [step, setStep] = useState(0);

  const stepsComponent: { [key: number]: JSX.Element } = {
    0: <ProfileView setStep={setStep} {...props} />,
    1: <ProfileEdit setStep={setStep} close={props.close} />,
  };

  return stepsComponent[step];
};

export default Profile;
