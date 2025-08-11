import React, { MouseEvent, useContext, useState } from "react";
import "./CannelCard.less";
import logo from "@/assets/images/logo.png";
import { Link } from "umi";
import { getFilesBaseOnLanguages } from "../../language/language";
import { followChannel } from "@/assets/Api";
import { Context } from "@/assets/Provider/Provider";
import { TOGGLE_TOPIC_FOLLOW_LIST } from "@/assets/Provider/types";

const CannelCard = (props: {
  data: {
    title: string;
    which_type: number;
    is_followed: number;
    id: string;
    image: string;
  };
}) => {
  const [data, setData] = useState(props.data);
  const lang = getFilesBaseOnLanguages();
  const { dispatch } = useContext(Context);

  const unfollew = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFollowStatus = data?.is_followed === 1 ? 0 : 1;
    setData((pre) => ({ ...pre, is_followed: newFollowStatus }));
    dispatch({
      type: TOGGLE_TOPIC_FOLLOW_LIST,
      data: { follow: !!newFollowStatus, channel_id: data.id },
    });
    followChannel(data.id, !!newFollowStatus);
  };

  return (
    <Link to={`/channel/${data.id}`} className="WeTooCannelCard">
      {data?.image && (
        <img className="WeTooCannelCard__avatar" src={data?.image} />
      )}
      <div className="WeTooCannelCard__name">{data?.title}</div>
      <div onClick={unfollew} className="WeTooCannelCard__btn">
        {!isNaN(Number(data?.is_followed)) &&
          data?.is_followed !== 2 &&
          (data?.is_followed === 1 ? lang["unfollow"] : lang["follow"])}
      </div>
    </Link>
  );
};

export default CannelCard;
