import JourneyCarousel from "./JourneyCarousel";
import "./JourneyContainerHeader.less";
import { useEffect, useState } from "react";
import { getScheduleList, onlineLives } from "@/assets/Api";

const JourneyContainerHeader = () => {
  const [scheduledData, setSchedulesData] = useState<
    { cover: string; date: string; description: string; title: string }[]
  >([]);
  const [onlineLivesList, setOnlineLivesList] = useState<
    {
      description: string;
      title: string;
      room_id: string;
      id: number;
      cover: string;
    }[]
  >([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    getScheduleList()
      .then((res: any) => {
        setScheduleLoading(false);
        if (res?.data) setSchedulesData(res.data);
      })
      .catch(() => {
        setScheduleLoading(false);
      });

    onlineLives()
      .then((res: any) => {
        setLiveLoading(false);
        if (res.data) setOnlineLivesList(res.data);
      })
      .catch(() => {
        setLiveLoading(false);
      });
  }, []);

  return (
    <div className="JourneyContainerHeader">
      <div className="JourneyContainerHeader__container group">
        {scheduleLoading || liveLoading ? (
          <div className="skeleton-box" style={{width:"100%", height:"300px"}} />
        ) : (scheduledData.length > 0 || onlineLivesList.length > 0) ? (
          <JourneyCarousel dataList={[...scheduledData, ...onlineLivesList]} />
        ) : (
          <div className="JourneyContainerHeader__container__danger">
            There is not any scheduled meeting
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyContainerHeader;
