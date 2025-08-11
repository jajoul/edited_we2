import React from "react";
import Nav from "@/components/Nav/Nav";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import ChannelContainer from "@/layouts/Channel/ChannelContainer";
import CheckLogin from "@/assets/Hooks/CheckLogin";

const Channel = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide={true} />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <ChannelContainer />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Channel;
