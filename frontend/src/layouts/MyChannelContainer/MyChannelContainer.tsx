import React, { useEffect, useState } from "react";
import "./MyChannelContainer.less";
import TopicList from "../NewChanel/TopicList/TopicList";
import { myChannels } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import CannelCard from "../InsightWebSearch/CannelCard/CannelCard";

const MyChannelContainer = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myChannels().then((res) => {
      setLoading(false);
      if (res.data) setChannels(res.data);
    });
  }, []);

  return (
    <div className="WeTooMyChannelContainer">
      <div className="WeTooMyChannelContainer__body">
        {loading ? (
          <Spinner purple={true} width="80px" />
        ) : channels.length > 0 ? (
          channels.map((item, index) => <CannelCard key={index} data={item} />)
        ) : (
          <div className="WeTooMyChannelContainer__body__message">
            You have no active channel, try to add new one
          </div>
        )}
      </div>
      <TopicList />
    </div>
  );
};

export default MyChannelContainer;
