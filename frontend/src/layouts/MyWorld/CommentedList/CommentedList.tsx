import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./CommentedList.less";
import { useEffect, useState } from "react";
import { Link, history } from "umi";
import { commentedChannels, likedChannels } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";
import TopicCard from "@/layouts/InsightWeb/InsightExplore/RowView/TopicCard.tsx/TopicCard";
import { Topic } from "@/assets/Provider/types";
import Title, { size } from "@/components/Title/Title";
import arrowLeft from "@/assets/images/arrow-left.svg";

const CommentedList = (props: { searchValue?: string }) => {
  const { searchValue } = props;

  const location = history.location.pathname;
  const [loading, setLoading] = useState(true);

  const handleDeleteTopic = (topicId: number) => {
    // Remove the deleted topic from the current list
    setChannels(prevChannels => prevChannels.filter(channel => channel.id !== topicId));
  };
  const [channels, setChannels] = useState<
    {
      picture: string;
      name: string;
      id: number;
      like_count: number;
      comments_count: number;
      channel_info: { image: string; title: string };
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    if (location.includes("commented")) {
      commentedChannels().then((res) => {
        setLoading(false);
        if (res.data) setChannels(res.data);
      });
    } else {
      likedChannels().then((res) => {
        setLoading(false);
        if (res.data) setChannels(res.data);
      });
    }
  }, []);

  return (
    <div className="WeTooCommentedList">
      <div className="WeTooCommentedList__body">
        <div className="WeTooCommentedList__header">
          <Link to="/my-world">
            <img src={arrowLeft} />
          </Link>
          <Title
            className="WeTooCommentedList__header__title"
            title={
              location.includes("commented")
                ? "Commented topics"
                : "Liked topics"
            }
            size={size.small}
          />
        </div>
        {loading ? (
          <Spinner purple={true} width="80px" />
        ) : channels.length > 0 ? (
          channels.map((item:any) => {
            const data: Topic = {
              id: item.id,
              channel_id: item.channel_info.title,
              name: item.name,
              channel_name: item.channel_info.title,
              channel_image: item.channel_info.image,
              description: "",
              location: null,
              video: null,
              picture: null,
              pdf: null,
              which_type: 1,
              likes_count: item.likes_count,
              comments_count: item.comments_count,
              tags: [],
              created_at: item.created_at,
              updated_at: item.updated_at,
              comments: [],
              is_editable: false,
            };
            if (
              !searchValue ||
              data.name?.toLowerCase()?.includes(searchValue?.toLowerCase())
            )
              return <TopicCard data={data} key={item.id} onDelete={handleDeleteTopic} />;
            else return <></>;
          })
        ) : (
          <div>There is'nt any channel</div>
        )}
      </div>
      <TopicList />
    </div>
  );
};

export default CommentedList;
