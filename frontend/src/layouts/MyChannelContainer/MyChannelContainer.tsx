import React, { useEffect, useState } from "react";
import "./MyChannelContainer.less";
import TopicList from "../NewChanel/TopicList/TopicList";
import { myChannels, updateLocalData } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import CannelCard from "../InsightWebSearch/CannelCard/CannelCard";

const MyChannelContainer = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("MyChannelContainer: Starting to fetch channels...");
    // Update local data to ensure we have the latest access token
    updateLocalData();
    
    // Get the current access token dynamically
    const currentAccessToken = localStorage.getItem("WeTooAccessToken");
    const tokenData = currentAccessToken ? JSON.parse(currentAccessToken) : {};
    const userToken = tokenData?.access;
    
    console.log("MyChannelContainer: Current access token:", userToken);
    
    // Check if user is authenticated
    if (!userToken) {
      console.log("MyChannelContainer: User not authenticated, redirecting to login");
      setLoading(false);
      setError("Please log in to view your channels");
      return;
    }
    
    myChannels().then((res) => {
      console.log("MyChannelContainer: API response received:", res);
      setLoading(false);
      // Check if response is successful and has data
      if (res && res.status >= 200 && res.status < 300 && res.data) {
        console.log("MyChannelContainer res.data:", res.data);
        console.log("MyChannelContainer res.data type:", typeof res.data);
        console.log("MyChannelContainer res.data is array:", Array.isArray(res.data));
        setChannels(Array.isArray(res.data) ? res.data : res.data.results || []);
        setError("");
      } else if (res && res.response && res.response.status === 404) {
        // Handle 404 case (no channels found) - set empty array
        console.log("MyChannelContainer: 404 - No channels found");
        setChannels([]);
        setError("");
              } else {
          // Handle other errors
          console.log("MyChannelContainer: Error response:", res);
          setChannels([]);
          
          // Check if response is HTML (backend server not running)
          if (typeof res.data === 'string' && res.data.includes('<!DOCTYPE html>')) {
            setError("Backend server is not running. Please contact support.");
          } else {
            setError("Failed to load channels. Please try again.");
          }
          console.error("Error loading channels:", res);
        }
    }).catch((err) => {
      console.log("MyChannelContainer: Exception caught:", err);
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
