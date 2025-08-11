import Title, { size } from "@/components/Title/Title";
import React, { useContext } from "react";
import "./TopicList.less";
import TopicCard from "@/layouts/InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import { Context } from "@/assets/Provider/Provider";

const TopicList = () => {
  const { state } = useContext(Context);

  return !!state.topics?.length ? (
    <div className="WeTooTopicList">
      <Title title="Topics you followed" size={size.small} />
      {state.topics?.map((item) => (
        <TopicCard className="WeTooTopicList__card" data={item} />
      ))}
    </div>
  ) : (
    <></>
  );
};

export default TopicList;
