import likeIcon from "@/assets/images/smallIcons/likeColored.svg";
import commentIcon from "@/assets/images/smallIcons/commentColored.svg";
import "./ActivityCard.less";
import { Link } from "umi";

const ActivityCard = (props: {
  data: {
    commented_by?: string;
    is_seen?: boolean;
    topic_id?: string | number;
    topic_name?: string;
    type?: string;
    liked_by?: string;
  };
}) => {
  const { data } = props;

  return (
    <Link to={`/topic/${data.topic_id}`}>
      <div className={`WeTooActivityCard ${!data.is_seen && 'WeTooActivityCard--active'}`}>
        <div className="WeTooActivityCard__imgContainer">
          <img src={data.type === "comment" ? commentIcon : likeIcon} />
        </div>
        <div>
          <div className="WeTooActivityCard__title">{data.topic_name}</div>
          <div className="WeTooActivityCard__description">
            {data.commented_by
              ? `commented by ${data.commented_by}`
              : `Liked by ${data.liked_by}`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;
