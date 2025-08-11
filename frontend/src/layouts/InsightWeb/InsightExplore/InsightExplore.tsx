import React, { useContext, useEffect, useState } from "react";
import InsightWebTags from "./InsightWebTags/InsightWebTags";
import InsightSubject from "./InsightSubject/InsightSubject";
import RowView from "./RowView/RowView";
import "./InsightExplore.less";
import { getFilesBaseOnLanguages } from "../../language/language";
import { Context } from "@/assets/Provider/Provider";
import { newestTopicsList, topTopics } from "@/assets/Api";

const InsightExplore = () => {
  const lang = getFilesBaseOnLanguages();
  const { state } = useContext(Context);

  const [newestTopics, setNewestTopics] = useState([]);
  const [topTopicsList , setTopTopicsList] = useState([])

  useEffect(() => {
    newestTopicsList(3).then((res) => {
      if (res.data) setNewestTopics(res.data);
    });
    topTopics(3).then(res => {
      if(res.data) setTopTopicsList(res.data)
    })
  }, []);

  return (
    <div className="WeTooInsightExplore WeTooMainContainer__contentContainer">
      <InsightWebTags
        tags={[
          { id: "1", name: lang["all_forums"], link: "/topics/all" }, //topic
          { id: "2", name: lang["recommended"], link: "/topics/recommended" }, //recommended-topics
          { id: "3", name: lang["new_topics"], link: "/topics/new" }, //top-topics
          { id: "4", name: lang["top_topics"], link: "/topics/top" }, //top-topics
        ]}
      />

      <InsightSubject />
      <RowView
        title={lang["topics_you_followed"]}
        id="followed"
        topics={state.topics?.slice(0, 2) || []}
      />
      <RowView title={lang["new_topics"]} id="new" topics={newestTopics} />
      <RowView title={lang["top_topics"]} id="top" topics={topTopicsList} />
    </div>
  );
};

export default InsightExplore;
