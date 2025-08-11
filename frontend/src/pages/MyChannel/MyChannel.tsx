import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import MyChannelContainer from "@/layouts/MyChannelContainer/MyChannelContainer";
import React from "react";

const MyChannel = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <MyChannelContainer />
        </div>
      </div>
    </CheckLogin>
  );
};

export default MyChannel;
