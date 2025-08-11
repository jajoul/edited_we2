import "./SideMenu.less";
import MainView from "./MainView";
import { useState } from "react";
import Profile from "./Profile/Profile";
import Security from "./Security/Security";
import Support from "./Support/Support";

const SideMenu = (props: { show: boolean; hideMenu: () => void }) => {
  const { show, hideMenu } = props;
  const [view, setView] = useState<number>(1);

  const close = () => {
    setView(1)
    hideMenu()
  }


  const componentMap: { [key: number]: JSX.Element } = {
    1: <MainView setView={setView} close={close}/>,
    2: <Profile setView={setView} close={close} />,
    3: <Security setView={setView} close={close} />,
    4: <Support setView={setView} close={close} />,
  };

  return (
    <>
      {show && (
        <div onClick={hideMenu} className="WeTooSideMenuClickListener" />
      )}
      <div className={`WeTooSideMenu ${show && "WeTooSideMenu--active"}`}>
        {componentMap[view]}
      </div>
    </>
  );
};

export default SideMenu;
