import React, { useEffect, useState } from "react";
import "./InsightWebSearchContainer.less";
import { searchTopics, searchChannels } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import TopicCard from "@/layouts/InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import CannelCard from "./CannelCard/CannelCard";
import { Topic } from "@/assets/Provider/types";
import { getFilesBaseOnLanguages } from "../language/language";
import { getSearchParam } from "@/components/MenuBar/MenuBar";

const InsightWebSearchContainer = (props: { searchValue?: string }) => {
  let timer: NodeJS.Timeout;
  const [active, setActive] = useState("topic");
  const lang = getFilesBaseOnLanguages();

  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");

  const startSearch = (value: string) => {
    setError("");
    searchTopics(value).then((res) => {
      if (res && res.status >= 200 && res.status < 300 && res.data) {
        setTopics(res.data);
      } else {
        setTopics([]);
        console.error("Error searching topics:", res);
      }
      if (active === "topic") setLoading(false);
    }).catch((err) => {
      setTopics([]);
      console.error("Error searching topics:", err);
      if (active === "topic") setLoading(false);
    });
    
    searchChannels(value).then((res) => {
      if (res && res.status >= 200 && res.status < 300 && res.data) {
        setChannels(res.data);
      } else {
        setChannels([]);
        console.error("Error searching channels:", res);
      }
      if (active === "channel") setLoading(false);
    }).catch((err) => {
      setChannels([]);
      console.error("Error searching channels:", err);
      if (active === "channel") setLoading(false);
    });
  };

  useEffect(() => {
    const searchParams = getSearchParam("value");
    if (!!searchParams) startSearch(searchParams);
    else {
      setTopics([]);
      setChannels([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (!!props.searchValue) startSearch(props.searchValue);
      else {
        setTopics([]);
        setChannels([]);
        setLoading(false);
      }
    }, 500);
  }, [props.searchValue]);

  const handleDeleteTopic = (topicId: number) => {
    // Remove the deleted topic from the current list
    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
  };

  const emptyState = (
    <div className="WeTooInsightWebSearchContainer__emptyState">There isn't any result. please search another thing.</div>
  );

  return (
    <>
      <div className="WeTooInsightWebSearchContainerMobileHeader">
        General Search
      </div>
      <div className="WeTooInsightWebSearchContainer">
        <div className="WeTooInsightWebSearchContainer__searchBar">
          <input
            value={getSearchParam("value")}
            type="text"
            onChange={() => {}}
          />
        </div>
        <div className="WeTooInsightWebSearchContainer__selector">
          <div
            onClick={() => setActive("topic")}
            className={`WeTooInsightWebSearchContainer__selector__item
          ${
            active === "topic" &&
            "WeTooInsightWebSearchContainer__selector__item--active"
          }`}
          >
            {lang["all_topics"]}
          </div>
          <div
            onClick={() => setActive("channel")}
            className={`WeTooInsightWebSearchContainer__selector__item
          ${
            active === "channel" &&
            "WeTooInsightWebSearchContainer__selector__item--active"
          }`}
          >
            {lang["channels"]}
          </div>
        </div>
        <div className="WeTooInsightWebSearchContainer__list">
          {loading ? (
            <Spinner
              purple={true}
              width="80px"
              className="WeTooInsightWebSearchContainer__list__spinner"
            />
          ) : error ? (
            <div className="WeTooInsightWebSearchContainer__error">
              {error}
            </div>
          ) : active === "topic" ? (
            topics.length > 0 ? (
              topics.map((item, index) => <TopicCard data={item} key={index} onDelete={handleDeleteTopic} />)
            ) : (
              emptyState
            )
          ) : channels.length > 0 ? (
            channels.map((item, index) => (
              <CannelCard key={index} data={item} />
            ))
          ) : (
            emptyState
          )}
        </div>
      </div>
    </>
  );
};

export default InsightWebSearchContainer;
