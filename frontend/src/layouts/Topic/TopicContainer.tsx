import React, { useEffect, useState } from "react";
import "./TopicContainer.less";
import PageTemplate from "../NewChanel/PageTemplate/PageTemplate";
import InsightWebTags from "../InsightWeb/InsightExplore/InsightWebTags/InsightWebTags";

import logo from "@/assets/images/logo.png";
import CommentCard from "./CommentCard/CommentCard";
import CreateComment from "./CreateComment/CreateComment";
import ReactPlayer from "react-player/lazy";
// import mapPreview from "@/assets/images/mapPreview.png";
import pdfPreViewer from "@/assets/images/pdfPreview.png";
import Modal from "@/components/Modal/Modal";
import MapPicker from "react-google-map-picker";
import { Link, useParams } from "umi";
import EditIcon from "@/assets/images/smallIcons/BlueEdit.svg";
import {
  getTopicById,
  getTopicComments,
  getTopicLike,
  sendTopicComment,
  toggleTopicLike,
} from "@/assets/Api";
import { getFilesBaseOnLanguages } from "../language/language";
import { Comment, Topic } from "@/assets/Provider/types";

const TopicContainer = () => {
  const [topicData, setTopicData] = useState<Topic>({} as Topic);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getTopicById(id).then((res:any) => {
        if (res.data) setTopicData(res.data);
      });
      getTopicLike(id || "").then((res) => {
        if (res.data) setLiked(res.data.is_liked);
      });
      getTopicComments(id || "").then((res) => {
        if (res.data) setComments(res.data);
      });
    }
  }, []);

  const [modal, setModal] = useState<boolean | string>(false);

  const lang = getFilesBaseOnLanguages();

  const DefaultLocation = { lat: 10, lng: 106 };
  const DefaultZoom = 10;

  const toggleLike = () => {
    toggleTopicLike(id || "", !liked);
    setLiked((pre) => !pre);
  };

  const addComment = (comment: string, score: number) => {
    sendTopicComment(id || "", score, comment).then((res) => {
      if (res.data) setComments((pre) => [...pre, res.data]);
    });
  };

  const modalContent = () => {
    if (modal === "image") {
      return <img src={topicData.picture || ""} />;
    } else if (modal === "video") {
      return (
        <ReactPlayer
          controls={true}
          url={topicData.video || ""}
          width="100%"
          height="100%"
        />
      );
    } else if (modal === "map") {
      return (
        <MapPicker
          defaultLocation={DefaultLocation}
          zoom={DefaultZoom}
          style={{ height: "100%", width: "100%" }}
          apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
        />
      );
    }
    return <></>;
  };

  return (
    <>
      <div className="WeTooTopicContainer ">
        <PageTemplate
          children={
            <>
              <div className="WeTooTopicContainer__template__header">
                <img
                  src={topicData.channel_image}
                  className="WeTooTopicContainer__template__avatar"
                />
                <div className="WeTooTopicContainer__template__info">
                  <h4 className="WeTooTopicContainer__template__title">
                    {topicData.name}
                  </h4>
                  <div className="WeTooTopicContainer__template__date">
                    {topicData?.created_at &&
                      new Date(topicData?.created_at).toDateString()}
                  </div>
                </div>
                {topicData.is_editable && <Link className="WeTooTopicContainer__template__editIcon" to={`/topic/edit/${topicData.id}`}>
                  <img src={EditIcon} />
                </Link>}
                {topicData?.which_type === 0 && (
                  <img
                    src={logo}
                    className="WeTooTopicContainer__template__logo"
                  />
                )}
              </div>
              <p className="WeTooTopicContainer__template__description">
                {topicData.description}
              </p>
              <div className="WeTooTopicContainer__template__additions">
              
                {topicData.video && (
                  <div className="WeTooTopicContainer__template__additionItem">
                    <video
                      src={topicData.video}
                      onClick={() => setModal("video")}
                    />
                  </div>
                )}
                {topicData.picture && (
                  <div className="WeTooTopicContainer__template__additionItem">
                    <img
                      src={topicData.picture}
                      onClick={() => setModal("image")}
                    />
                  </div>
                )}
                {topicData.pdf && (
                  <a
                    href={topicData.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="WeTooTopicContainer__template__additionItem"
                    // onClick={() => setModal("pdf")}
                  >
                    <img src={pdfPreViewer} />
                    {/* onClick={() => setModal("pdf")} */}
                  </a>
                )}
              </div>
              <InsightWebTags
                tags={topicData.tags}
                className="WeTooTopicContainer__template__tags"
              />
            </>
          }
          pageTitle={topicData.channel_name}
          className="WeTooTopicContainer__template"
          titleLink={`/channel/${topicData.channel_id}`}
        />
        <div className="WeTooTopicContainer__comments">
          <h4 className="WeTooTopicContainer__comments__title">
            {lang["comment"]}
          </h4>
          {comments && comments?.length > 0 ? (
            comments?.map((comment, index) => (
              <CommentCard data={comment} key={index} />
            ))
          ) : (
            <div className="WeTooTopicContainer__comments__message">
              {lang["no_comment"]}
            </div>
          )}
          <CreateComment
            toggleLike={toggleLike}
            liked={liked}
            addComment={addComment}
          />
        </div>
      </div>
      <Modal
        Close={() => setModal(false)}
        content={modalContent()}
        show={!!modal}
        className="WeTooTopicContainerModal"
      />
    </>
  );
};

export default TopicContainer;
