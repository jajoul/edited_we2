import Title, { size } from "@/components/Title/Title";
import React, { useContext } from "react";
import "./TopicList.less";
import TopicCard from "@/layouts/InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import { Context } from "@/assets/Provider/Provider";

const TopicList = () => {
  const { state, dispatch } = useContext(Context);

  const handleDeleteTopic = (topicId: number) => {
    // Remove the deleted topic from the global state
    const updatedTopics = state.topics?.filter(topic => topic.id !== topicId) || [];
    dispatch({ type: 'SET_TOPICS', data: { topics: updatedTopics } });
  };

  return !!state.topics?.length ? (
    <div className="WeTooTopicList">
      <Title title="Topics you followed" size={size.small} />
      {state.topics?.map((item) => (
        <TopicCard 
          key={item.id}
          className="WeTooTopicList__card" 
          data={item} 
          onDelete={handleDeleteTopic}
        />
      ))}
    </div>
  ) : (
    <></>
  );
};

export default TopicList;
