import React, { useEffect, useState } from "react";
import "./InsightWebSearchContainer.less";
import { history } from "umi";
import TopicCard from "../InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import CannelCard from "./CannelCard/CannelCard";
import { getSearchParam } from "@/components/MenuBar/MenuBar";
import { getFilesBaseOnLanguages } from "../language/language";
import { searchChannels, searchTopics } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import { Topic } from "@/assets/Provider/types";

let timer: any = null;

const InsightWebSearchContainer = (props: { searchValue: string }) => {
  const [active, setActive] = useState("topic");
  const lang = getFilesBaseOnLanguages();

  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [channels, setChannels] = useState([]);

  const startSearch = (value: string) => {
    searchTopics(value).then((res) => {
      if (res.data) setTopics(res.data);
      if (active === "topic") setLoading(false);
    });
    searchChannels(value).then((res) => {
      if (res.data) setChannels(res.data);
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
          ) : active === "topic" ? (
            topics.length > 0 ? (
              topics.map((item, index) => <TopicCard data={item} key={index} onDelete={handleDeleteTopic} />)
            ) : (
              emptyState
            )
          ) : channels.length > 0 ? (
            channels.map((item, index) => (
              <CannelCard data={item} key={index} />
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
