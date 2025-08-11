import React from "react";
import Nav from "@/components/Nav/Nav";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import TopicsContainer from "@/layouts/Topics/TopicsContainer";
import CheckLogin from "@/assets/Hooks/CheckLogin";

const Topics = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide={true} />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <TopicsContainer />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Topics;
