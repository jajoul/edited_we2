import React, { useEffect, useState } from "react";
import "./MyChannelContainer.less";
import TopicList from "../NewChanel/TopicList/TopicList";
import { myChannels } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import CannelCard from "../InsightWebSearch/CannelCard/CannelCard";

const MyChannelContainer = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    myChannels().then((res) => {
      setLoading(false);
      // Check if response is successful and has data
      if (res && res.status >= 200 && res.status < 300 && res.data) {
        setChannels(res.data);
        setError("");
      } else if (res && res.response && res.response.status === 404) {
        // Handle 404 case (no channels found) - set empty array
        setChannels([]);
        setError("");
      } else {
        // Handle other errors
        setChannels([]);
        setError("Failed to load channels. Please try again.");
        console.error("Error loading channels:", res);
      }
    }).catch((err) => {
      setLoading(false);
      setChannels([]);
      setError("Failed to load channels. Please try again.");
      console.error("Error loading channels:", err);
    });
  }, []);

  return (
    <div className="WeTooMyChannelContainer">
      <div className="WeTooMyChannelContainer__body">
        {loading ? (
          <Spinner purple={true} width="80px" />
        ) : error ? (
          <div className="WeTooMyChannelContainer__body__message">
            {error}
          </div>
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
