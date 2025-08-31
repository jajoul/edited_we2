import React, { useContext, useEffect, useState } from "react";
import { useParams } from "umi";
import TopicCard from "@/layouts/InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./TopicsContainer.less";
import arrowLeft from "@/assets/images/arrow-left.svg";
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
  const [error, setError] = useState("");
  const lang = getFilesBaseOnLanguages();
  const { filter } = useParams();
  const page_title = filter?.includes("tag=") ? "result" : `${filter}_topics`;
  const [loading, setLoading] = useState(true);

  const { state } = useContext(Context);

  const handleDeleteTopic = (topicId: number) => {
    // Remove the deleted topic from the current list
    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
  };

  useEffect(() => {
    if (filter) {
      if (filter === "all") {
        allTopics().then((res) => {
          setLoading(false);
          if (res && res.status >= 200 && res.status < 300 && res.data) {
            setTopics(res.data);
            setError("");
          } else {
            setTopics([]);
            setError("Failed to load topics. Please try again.");
            console.error("Error loading all topics:", res);
          }
        }).catch((err) => {
          setLoading(false);
          setTopics([]);
          setError("Failed to load topics. Please try again.");
          console.error("Error loading all topics:", err);
        });
      } else if (filter === "recommended") {
        recommendedTopics().then((res) => {
          setLoading(false);
          if (res && res.status >= 200 && res.status < 300 && res.data) {
            setTopics(res.data);
            setError("");
          } else {
            setTopics([]);
            setError("Failed to load recommended topics. Please try again.");
            console.error("Error loading recommended topics:", res);
          }
        }).catch((err) => {
          setLoading(false);
          setTopics([]);
          setError("Failed to load recommended topics. Please try again.");
          console.error("Error loading recommended topics:", err);
        });
      } else if (filter === "top") {
        topTopics().then((res) => {
          setLoading(false);
          if (res && res.status >= 200 && res.status < 300 && res.data) {
            setTopics(res.data);
            setError("");
          } else {
            setTopics([]);
            setError("Failed to load top topics. Please try again.");
            console.error("Error loading top topics:", res);
          }
        }).catch((err) => {
          setLoading(false);
          setTopics([]);
          setError("Failed to load top topics. Please try again.");
          console.error("Error loading top topics:", err);
        });
      } else if (filter === "new") {
        newestTopicsList().then((res) => {
          setLoading(false);
          if (res && res.status >= 200 && res.status < 300 && res.data) {
            setTopics(res.data);
            setError("");
          } else {
            setTopics([]);
            setError("Failed to load newest topics. Please try again.");
            console.error("Error loading newest topics:", res);
          }
        }).catch((err) => {
          setLoading(false);
          setTopics([]);
          setError("Failed to load newest topics. Please try again.");
          console.error("Error loading newest topics:", err);
        });
      } else if (filter === "followed") {
        setLoading(false);
        setTopics(state.topics || []);
        setError("");
      } else if (filter.includes("tag=")) {
        const tagId = filter.replace("tag=", "");
        filterTopicsByTag(tagId).then((res) => {
          setLoading(false);
          if (res && res.status >= 200 && res.status < 300 && res.data) {
            setTopics(res.data);
            setError("");
          } else {
            setTopics([]);
            setError("Failed to load topics by tag. Please try again.");
            console.error("Error loading topics by tag:", res);
          }
        }).catch((err) => {
          setLoading(false);
          setTopics([]);
          setError("Failed to load topics by tag. Please try again.");
          console.error("Error loading topics by tag:", err);
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
          ) : error ? (
            <div className="WeTooTopicsContainer__error">
              {error}
            </div>
          ) : topics?.length > 0 ? (
            topics.map((topic) => (
              <TopicCard
                key={topic.id}
                data={topic}
                className="WeTooTopicsContainer__list__topicCard"
                onDelete={handleDeleteTopic}
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
