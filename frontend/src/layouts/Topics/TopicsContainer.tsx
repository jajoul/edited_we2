import React, { useContext, useEffect, useState } from "react";
import "./TopicsContainer.less";
import TopicList from "../NewChanel/TopicList/TopicList";
import arrowLeft from "@/assets/images/arrow-left.svg";
import TopicCard from "../InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import { useParams } from "umi";
import { getFilesBaseOnLanguages } from "../language/language";
import {
  allTopics,
  filterTopicsByTag,
  newestTopicsList,
  recommendedTopics,
  topTopics,
} from "@/assets/Api";
import { Context } from "@/assets/Provider/Provider";
import { Topic } from "@/assets/Provider/types";
import Spinner from "@/components/Spinner/Spinner";

const TopicsContainer = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const lang = getFilesBaseOnLanguages();
  const { filter } = useParams();
  const page_title = filter?.includes("tag=") ? "result" : `${filter}_topics`;
  const [loading, setLoading] = useState(true);

  const { state } = useContext(Context);

  useEffect(() => {
    if (filter) {
      if (filter === "all") {
        allTopics().then((res) => {
          setLoading(false);
          setTopics(res.data);
        });
      } else if (filter === "recommended") {
        recommendedTopics().then((res) => {
          setLoading(false);
          setTopics(res.data);
        });
      } else if (filter === "top") {
        topTopics().then((res) => {
          setLoading(false);
          setTopics(res.data);
        });
      } else if (filter === "new") {
        newestTopicsList().then((res) => {
          setLoading(false);
          setTopics(res.data);
        });
      } else if (filter === "followed") {
        setLoading(false);
        setTopics(state.topics || []);
      } else if (filter.includes("tag=")) {
        const tagId = filter.replace("tag=", "");
        filterTopicsByTag(tagId).then((res) => {
          setLoading(false);
          setTopics(res.data);
        });
      }
    }
  }, []);

  return (
    <div className="WeTooTopicsContainer">
      <div className="WeTooTopicsContainer__list WeTooMainContainer__contentContainer">
        <div className="WeTooTopicsContainer__list__header">
          {lang[page_title] || page_title}
          <img
            src={arrowLeft}
            className="WeTooTopicsContainer__list__backBtn"
            onClick={() => window.history.go(-1)}
          />
        </div>
        <div className="WeTooTopicsContainer__list__cards">
          {loading ? (
            <Spinner
              className="WeTooTopicsContainer__loader"
              purple={true}
              width="80px"
            />
          ) : topics?.length > 0 ? (
            topics.map((topic) => (
              <TopicCard
                data={topic}
                className="WeTooTopicsContainer__list__topicCard"
              />
            ))
          ) : (
            <p>No topics with this filter</p>
          )}
        </div>
      </div>
      <TopicList />
    </div>
  );
};

export default TopicsContainer;
