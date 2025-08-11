import { useState } from "react";
import ViewHeaders from "../ViewHeaders/ViewHeaders";
import ChangePassword from "./ChangePassword/ChangePassword";
import './Security.less'

const Security = (props: {
  setView: (viewId: number) => void;
  close: () => void;
}) => {
  const { setView, close } = props;

  const options: { [key: string]: { component: JSX.Element } } = {
    "Change Password": { component: <ChangePassword close={close} /> },
  };

  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  return (
    <>
      <ViewHeaders goHome={() => setView(1)} title="Setting" close={close} />
      {selectedTab ? (
        options[selectedTab].component
      ) : (
        <div className="weTooSecurityList">
          {Object.entries(options).map((item, index) => (
            <div className="weTooSecurityList__item" key={index} onClick={() => setSelectedTab(item[0])}>
              {item[0]}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Security;
