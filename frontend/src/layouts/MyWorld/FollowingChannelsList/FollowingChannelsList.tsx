import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./FollowingChannelsList.less";
import { useEffect, useState } from "react";
import { followingChannels } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import Title, { size } from "@/components/Title/Title";
import arrowLeft from "@/assets/images/arrow-left.svg";
import CannelCard from "@/layouts/InsightWebSearch/CannelCard/CannelCard";
import { Link } from "umi";

const FollowingChannelsList = (props: { searchValue?: string }) => {
  const { searchValue } = props;

  const [channels, setChannels] = useState<
    { title: string; id: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    followingChannels().then((res) => {
      setLoading(false);
      if (res.data) setChannels(res.data);
    });
  }, []);

  return (
    <div className="WeTooFollowingChannelsList">
      <div className="WeTooFollowingChannelsList__body">
        <div className="WeTooFollowingChannelsList__header">
          <Link to={"/my-world"}>
            <img src={arrowLeft} />
          </Link>
          <Title
            className="WeTooFollowingChannelsList__title"
            title="Followings"
            size={size.small}
          />
        </div>
        {loading ? (
          <Spinner purple={true} width="80px" />
        ) : (
          <div>
            {channels.length > 0 ? (
              channels.map((item) =>
                !searchValue ||
                item.title
                  .toLowerCase()
                  .includes(searchValue?.trim()?.toLowerCase()) ? (
                  <CannelCard
                    key={item.id}
                    data={{ ...item, is_followed: 1, which_type: 0 }}
                  />
                ) : (
                  <></>
                )
              )
            ) : (
              <div>There isn't any followed channel</div>
            )}
          </div>
        )}
      </div>
      <TopicList />
    </div>
  );
};

export default FollowingChannelsList;
