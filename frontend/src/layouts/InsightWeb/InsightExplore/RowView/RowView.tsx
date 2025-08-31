import Title, { size } from "@/components/Title/Title";
import React from "react";
import "./RowView.less";
import TopicCard from "./TopicCard.tsx/TopicCard";
import avatar from "@/assets/images/main3.png";
import { Link } from "umi";
import { getFilesBaseOnLanguages } from "../../../language/language";
import { Topic } from "@/assets/Provider/types";

const RowView = (props: { title: string; id: string; topics: Topic[] }) => {
  const lang = getFilesBaseOnLanguages();
  const { title, id, topics } = props;

  const handleDeleteTopic = (topicId: number) => {
    // Remove the deleted topic from the list
    // This will trigger a re-render with the updated list
    // The parent component should handle the actual data update
    console.log(`Topic ${topicId} deleted`);
  };

  if (!!topics?.length)
    return (
      <div className="WeTooRowView">
        <div className="WeTooRowView__header">
          <Title size={size.small} title={title} />
          <Link to={`/topics/${id}`} className="WeTooRowView__header__btn">
            {lang["see_all"]}
          </Link>
        </div>
        <div className="WeTooRowView__row">
          {topics?.map((item, index) => (
            <TopicCard 
              className="WeTooRowView__row__topicCard" 
              key={index} 
              data={item} 
              onDelete={handleDeleteTopic}
            />
          ))}

          <div className="WeTooRowView__row__endShadow" />
        </div>
      </div>
    );
  else return <></>;
};

export default RowView;
