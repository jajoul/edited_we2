import test from "@/assets/images/test.png";

import home from "@/assets/images/smallIcons/home.svg";
import profile from "@/assets/images/smallIcons/profile.svg";
import support from "@/assets/images/smallIcons/support.svg";
import logout from "@/assets/images/smallIcons/logout.svg";
import { logout as logoutFunc } from "@/assets/functions";
import security from "@/assets/images/smallIcons/security.svg";
import { Link, history } from "umi";
import { useContext } from "react";
import { Context } from "@/assets/Provider/Provider";
import logo from "@/assets/images/logo.png";

import cover from '../../assets/images/WeTooLoginCoverPage.png'

const MainView = (props: {
  setView: (viewId: number) => void;
  close: () => void;
}) => {
  const { setView, close } = props;
  const { state } = useContext(Context);

  const showProfile = () => {
    setView(2);
  };

  const showSupport = () => {
    setView(4);
  };

  const showSecurity = () => {
    setView(3);
  };

  const menuListItem = [
    { label: "My Channels", link: "/my-channel", icon: home },
    { label: "My Profile", func: showProfile, icon: profile },
    { label: "Support", func: showSupport, icon: support },
    { label: "Security", func: showSecurity, icon: security },
    { label: "Logout", func: logoutFunc, icon: logout },
  ];

  const parent = (
    child: JSX.Element,
    index: number,
    link?: string,
    func?: () => void
  ) =>
    !!link ? (
      <Link key={index} className="WeTooSideMenu__list__item" to={link}>
        {child}
      </Link>
    ) : (
      <div onClick={func} key={index} className="WeTooSideMenu__list__item">
        {child}
      </div>
    );

  return (
    <>
      <div className="WeTooSideMenu__closeIcon" onClick={close}>
        ×
      </div>

      <div className="WeTooSideMenu__header">
        <div
          className={`WeTooSideMenu__avatar ${
            !state.userInfo?.profile.avatar && "WeTooSideMenu__avatar--contain"
          }`}
        >
          <img src={state.userInfo?.profile.avatar || logo} />
        </div>
        <div className="WeTooSideMenu__userInfo">
          <p>{state.userInfo?.profile.first_name}</p>
        </div>
      </div>

      <div className="WeTooSideMenu__list">
        {menuListItem.map((item, index) =>
          parent(
            <>
              <div className="WeTooSideMenu__list__icon">
                <img src={item.icon} />
              </div>
              <div>{item.label}</div>
            </>,
            index,
            item.link,
            item.func
          )
        )}
      </div>

      <img src={cover} className="WeTooSideMenu__mobileCover" />
    </>
  );
};

export default MainView;
