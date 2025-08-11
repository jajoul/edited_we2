import React from "react";
import Nav from "@/components/Nav/Nav";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import InsightQuestion from "@/layouts/InsightWeb/InsightQuestion/InsightQuestion";
import TopicContainer from "@/layouts/Topic/TopicContainer";
import CheckLogin from "@/assets/Hooks/CheckLogin";

const Topic = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide={true} />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <TopicContainer />
          <InsightQuestion mobileHide={true} />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Topic;
