import Nav from "@/components/Nav/Nav";
import InsightExplore from "@/layouts/InsightWeb/InsightExplore/InsightExplore";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import React from "react";
import InsightQuestion from "@/layouts/InsightWeb/InsightQuestion/InsightQuestion";
import "./InsightWeb.less";
import CheckLogin from "@/assets/Hooks/CheckLogin";

const InsightWeb = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <div className="WeTooInsightWeb">
            <InsightExplore />
            <InsightQuestion />
          </div>
        </div>
      </div>
    </CheckLogin>
  );
};

export default InsightWeb;
