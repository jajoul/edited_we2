import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./MyWorldContainer.less";
import followingIcon from "@/assets/images/smallIcons/following.svg";
import commentIcon from "@/assets/images/smallIcons/commentColored.svg";
import likeIcon from "@/assets/images/smallIcons/likeColored.svg";
import { useEffect, useState } from "react";
import { createMeet, lastActivity } from "@/assets/Api";
import Title, { size } from "@/components/Title/Title";
import { Link, history } from "umi";
import Spinner from "@/components/Spinner/Spinner";
import ActivityCard from "./ActivityCard/ActivityCard";

const MyWorldContainer = (props: { searchValue?: string }) => {
  const { searchValue } = props;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetLoading, setMeetLoading] = useState(false);

  const customButton = (label: string, icon: string, link: string) => {
    return (
      <Link to={link} className="weTooMyWorldContainer__btn">
        <img src={icon} />
        {label}
      </Link>
    );
  };

  useEffect(() => {
    lastActivity(10).then((res) => {
      if (res.data) setData(res.data);
      setLoading(false);
    });
  }, []);

  const redirect = () => {
    if (!meetLoading) {
      setMeetLoading(true);
      createMeet().then((res: any) => {
        setMeetLoading(false);
        if (res?.data?.meet_id)
          history.push(`http://meet.me2we2.com/${res?.data?.meet_id}`);
      });
    }
  };

  return (
    <div className="weTooMyWorldContainer">
      <div className="weTooMyWorldContainer__body">
        <div className="weTooMyWorldContainer__btnContainer" onClick={redirect}>
          <div className="weTooMyWorldContainer__btn">
            {meetLoading && <Spinner purple={true} width="20px" />}&nbsp; Create
            meet
          </div>
        </div>
        <div className="weTooMyWorldContainer__btnContainer">
          {customButton("Followings", followingIcon, "/my-world/followings")}
        </div>
        <div className="weTooMyWorldContainer__btnContainer">
          {customButton("Commented topics", commentIcon, "/my-world/commented")}
          {customButton("Liked topics", likeIcon, "/my-world/liked")}
        </div>
        <div className="weTooMyWorldContainer__titles">
          <Title
            title="Last activities"
            size={size.small}
            className="weTooMyWorldContainer__title"
          />
          <Link
            to="/my-world/activities"
            className="weTooMyWorldContainer__titles__subTitle"
          >
            See all
          </Link>
        </div>
        <div className="weTooMyWorldContainer__body__list">
          {loading ? (
            <Spinner width="80px" purple />
          ) : data?.length > 0 ? (
            data.map((item:any, index) =>
              !searchValue ||
              item.topic_name
                .toloWercase()
                .includes(searchValue.toLowerCase()) ? (
                <ActivityCard data={item} key={index} />
              ) : (
                <></>
              )
            )
          ) : (
            <div>There is not any Activity</div>
          )}
        </div>
      </div>
      <TopicList />
    </div>
  );
};

export default MyWorldContainer;
