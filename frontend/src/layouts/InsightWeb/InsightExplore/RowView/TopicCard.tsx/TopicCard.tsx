import "./TopicCard.less";
import like from "../../../../../assets/images/smallIcons/like.svg";
import comment from "../../../../../assets/images/smallIcons/comment.svg";
import logo from "../../../../../assets/images/logo.png";
import { Link } from "umi";
import { getFilesBaseOnLanguages } from "../../../../language/language";
import { Topic } from "@/assets/Provider/types";

const TopicCard = (props: { data: Topic; className?: string }) => {
  const lang = getFilesBaseOnLanguages();
  const { data, className } = props;

  return (
    <Link to={`/topic/${data.id}`} className={`WeTooTopicCard ${className}`}>
      <div className="WeTooTopicCard__header">
        {data.channel_image && (
          <>
            <img
              className="WeTooTopicCard__avatar"
              src={
                data.channel_image[0] !== "/"
                  ? data.channel_image
                  : "https://social.me2we2.com" + data.channel_image
              }
            />
          </>
        )}
        <div className="WeTooTopicCard__info">
          <div className="WeTooTopicCard__info__title">{data.name}</div>
          <div className="WeTooTopicCard__info__date">
            {new Date(data.updated_at).toLocaleDateString()}
          </div>
        </div>
        {data.which_type === 0 && (
          <img className="WeTooTopicCard__logo" src={logo} />
        )}
      </div>
      {data.description && (
        <p className="WeTooTopicCard__description">{data.description}</p>
      )}
      <div className="WeTooTopicCard__footer">
        <div className="WeTooTopicCard__footer__item">
          <img src={like} />
          {data.likes_count} {lang["likes"]}
        </div>
        <div className="WeTooTopicCard__footer__item">
          <img src={comment} />
          {data.comments_count} {lang["comments"]}
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
