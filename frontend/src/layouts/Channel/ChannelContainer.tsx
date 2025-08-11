import react, { useContext, useEffect, useState } from "react";
import "./ChannelContainer.less";
import TopicList from "../NewChanel/TopicList/TopicList";
import PageTemplate from "../NewChanel/PageTemplate/PageTemplate";
import ChannelHeader from "../NewChanel/NewChanelSummery/ChannelHeader/ChannelHeader";
import TopicCard from "../InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import { Link, useParams } from "umi";
import { chanelTopicList, followChannel, getChannel } from "@/assets/Api";
import { getFilesBaseOnLanguages } from "../language/language";
import { TOGGLE_TOPIC_FOLLOW_LIST, channelData } from "@/assets/Provider/types";
import Spinner from "@/components/Spinner/Spinner";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import { Context } from "@/assets/Provider/Provider";

const ChannelContainer = () => {
  const [topics, setTopic] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [channelData, setChannelData] = useState<channelData>(
    {} as channelData
  );

  const lang = getFilesBaseOnLanguages();
  const [loading, setLoading] = useState(true);
  const { dispatch } = useContext(Context);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getChannel(id).then((res) => {
        if (res.data) setChannelData(res.data);
        chanelTopicList(id).then((res) => {
          setLoading(false);
          if (res.data) setTopic(res.data);
        });
      });
    }
  }, []);

  const toggleFollow = () => {
    if (!followLoading) {
      const newFollowStatus = channelData.is_followed === 0 ? 1 : 0;
      setFollowLoading(true);
      followChannel(String(channelData.id), !!newFollowStatus).then((res) => {
        setFollowLoading(false);
      });
      setChannelData((pre) => ({
        ...pre,
        is_followed: newFollowStatus,
        number_of_members: !!newFollowStatus
          ? pre.number_of_members + 1
          : pre.number_of_members - 1,
      }));
      dispatch({
        type: TOGGLE_TOPIC_FOLLOW_LIST,
        data: { follow: !!newFollowStatus, topics, channel_id: channelData.id },
      });
    }
  };

  return (
    <div className="WeTooChannelContainer">
      <div className="WeTooChannelContainer__body">
        <PageTemplate
          children={
            <>
              <ChannelHeader
                number_of_members={channelData.number_of_members}
                avatar={channelData.image}
                id={channelData.id}
                className="WeTooChannelContainer__header"
                CanEdit={channelData?.is_followed === 2}
              />
              {channelData?.is_followed !== 2 && (
                <Buttons
                  label={
                    channelData?.is_followed === 0
                      ? lang["follow"]
                      : lang["unfollow"]
                  }
                  theme={buttonTheme.gradient}
                  className="WeTooChannelContainer__followBtn"
                  loading={followLoading}
                  onClick={toggleFollow}
                />
              )}

              <div className="WeTooChannelContainer__headerContainer">
                <h4 className="WeTooChannelContainer__title">
                  {lang["about"]}
                </h4>
                <p className="WeTooChannelContainer__description">
                  {channelData?.about}
                </p>
              </div>
            </>
          }
          pageTitle={channelData.title || ""}
          className="WeTooChannelContainer__template"
        />

        <div className="WeTooChannelContainer__list">
          <h4 className="WeTooChannelContainer__title">{lang["topics"]}</h4>
          {loading ? (
            <Spinner
              className="WeTooChannelContainer__loader"
              purple={true}
              width="80px"
            />
          ) : !!topics && topics?.length > 0 ? (
            topics.map((item, index) => (
              <TopicCard
                data={item}
                key={index}
                className="WeTooChannelContainer__list__card"
              />
            ))
          ) : (
            <div className="WeTooChannelContainer__list__message">
              {lang["no_topics"]}
            </div>
          )}
        </div>
      </div>
      <TopicList />
      {channelData?.is_followed === 2 && (
        <Link
          to={`/new-topic/${id}`}
          className="WeTooChannelContainer__addBtn"
        />
      )}
    </div>
  );
};

export default ChannelContainer;
