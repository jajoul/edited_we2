import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import NewChanelContainer from "@/layouts/NewChanel/NewChanelContainer";
import React from "react";

const NewChanel = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide={true} />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <NewChanelContainer />
        </div>
      </div>
    </CheckLogin>
  );
};

export default NewChanel;
