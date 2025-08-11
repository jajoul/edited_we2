import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./ActivitiesList.less";
import { useEffect, useState } from "react";
import { lastActivity } from "@/assets/Api";
import Title, { size } from "@/components/Title/Title";
import arrowLeft from "@/assets/images/arrow-left.svg";
import { Link } from "umi";
import Spinner from "@/components/Spinner/Spinner";
import ActivityCard from "../MyWorldContainer/ActivityCard/ActivityCard";

const ActivitiesList = (props: { searchValue?: string }) => {
  const { searchValue } = props;

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    lastActivity().then((res) => {
      if (res.data) setActivities(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="weTooActivitiesList">
      <div className="weTooActivitiesList__body">
        <div className="weTooActivitiesList__header">
          <Link to="/my-world">
            <img src={arrowLeft} />
          </Link>
          <Title
            className="weTooActivitiesList__header__title"
            title={"Last activities"}
            size={size.small}
          />
        </div>
        <div>
          {loading ? (
            <Spinner width="80px" purple />
          ) : (
            activities.map((item: any, index) =>
              !searchValue ||
              item.topic_name
                .toLowercase()
                .includes(searchValue.trim().toLowerCase()) ? (
                <ActivityCard data={item} key={index} />
              ) : (
                <></>
              )
            )
          )}
        </div>
      </div>
      <TopicList />
    </div>
  );
};

export default ActivitiesList;
