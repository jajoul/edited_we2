import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./JourneyLiveContainer.less";
import { useState } from "react";
import ScheduledTab from "./ScheduledTab/ScheduledTab";
import NowTab from "./NowTab/NowTab";
import UploadTab from "./UploadTab/UploadTab";
import arrowIcon from "@/assets/images/arrow-left.svg";
import { Link, Navigate, history } from "umi";
import WatchTab from "./WatchTab/WatchTab";

const JourneyLiveContainer = () => {
  const getSelectedTab = () => {
    const search = location.search;
    if (search.includes("room_id")) return "watch";
    else return "scheduled";
  };

  const list = [
    { title: "Scheduled", id: "scheduled", component: <ScheduledTab /> },
    { title: "Now", id: "now", component: <NowTab /> },
    { title: "Upload", id: "upload", component: <UploadTab /> },
    { title: "Watch", id: "watch", component: <WatchTab />, hide: true },
  ];

  const [selectedTab, setSelectedTab] = useState(getSelectedTab());

  const changeTabAndResetURL = (item: any) => {
    setSelectedTab(item.id);
    history.push("/journey/live");
  };

  return (
    <div className="WeTooJourneyLiveContainer">
      <div className="WeTooJourneyLiveContainer__container">
        <div className="WeTooJourneyLiveContainer__header">
          <Link to={"/journey"}>
            <img
              className="WeTooJourneyLiveContainer__header__backIcon"
              src={arrowIcon}
            />
          </Link>
          {selectedTab === "watch" ? "Watch Live" : "Create Live"}
        </div>
        <div className="WeTooJourneyLiveContainer__body">
          {selectedTab !== "watch" && <div className="WeTooJourneyLiveContainer__body__tab">
            {list.map(
              (item, index) =>
                !item.hide && (
                  <div
                    className={`WeTooJourneyLiveContainer__body__tabItem
              ${
                item.id === selectedTab &&
                "WeTooJourneyLiveContainer__body__tabItem--active"
              }`}
                    onClick={() => changeTabAndResetURL(item)}
                    key={index}
                  >
                    {item.title}
                  </div>
                )
            )}
          </div>}
          {list.find((item) => item.id === selectedTab)?.component}
        </div>
      </div>
      <TopicList />
    </div>
  );
};

export default JourneyLiveContainer;
