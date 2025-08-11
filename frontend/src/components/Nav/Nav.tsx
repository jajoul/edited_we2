import React, { useContext, useState } from "react";
import "./Nav.less";
import whiteLogo from "@/assets/images/logo-white.svg";
import Logo from "@/assets/images/logo.png";
import { Link } from "umi";
import Modal from "../Modal/Modal";
import AddTopicModal from "@/layouts/InsightWeb/AddTopicModal/AddTopicModal";
import { Context } from "@/assets/Provider/Provider";
import SideMenu from "../SideMenu/SideMenu";

const Nav = (props: { mobileHide?: boolean }) => {
  const { mobileHide } = props;
  const [showAddModal, setShowAddModal] = useState(false);
  const { state } = useContext(Context);
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <nav className={`WeTooNav ${mobileHide && "WeTooNav--mobileHide"}`}>
        <Link to="/insight-web" className="WeTooNav__logo">
          <img src={whiteLogo} />
          We too
        </Link>
        <div className="WeTooNav__options">
          <div
            onClick={() => setShowPanel((pre) => !pre)}
            className={`WeTooNav__options__logo 
          ${!state?.userInfo?.profile?.avatar &&
              "WeTooNav__options__logo--padding"
              }`}
          >
            <img src={state?.userInfo?.profile?.avatar || Logo} />
          </div>
          <div
            onClick={() => setShowAddModal(true)}
            className="WeTooNav__options__addBtn"
          >
            +
          </div>

          <SideMenu hideMenu={() => setShowPanel(false)} show={showPanel} />
        </div>
      </nav>

      <Modal
        Close={() => setShowAddModal(false)}
        content={<AddTopicModal />}
        show={showAddModal}
        className=""
      />
    </>
  );
};

export default Nav;
