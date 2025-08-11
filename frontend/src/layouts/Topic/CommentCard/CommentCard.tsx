import React, { useState } from "react";
import "./CommentCard.less";
import { Comment } from "@/assets/Provider/types";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import { getCommentReplies, replyComment } from "@/assets/Api";
import { ReactComponent as Star } from "@/assets/images/smallIcons/star.svg";

const CommentCard = (props: { data: Comment }) => {
  const [data, setData] = useState(props.data);
  const {
    profile_image,
    content,
    reply_counter,
    profile_name,
    created_at,
    id,
  } = data;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState<null | Comment[]>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);

  const calculateTime = () => {
    const now = new Date().getTime();
    const replyTime = new Date(created_at).getTime();
    let difference = now - replyTime;

    var ms = difference % 1000;
    difference = (difference - ms) / 1000; //seconds

    var secs = difference % 60;
    difference = (difference - secs) / 60; //minutes

    var mins = difference % 60;
    difference = (difference - mins) / 60

    var hrs = difference % 60;
    difference = (difference - hrs) / 60; //minutes

    var days = difference % 24;

    if (!!days) return `${days}d`
    else if (!!hrs) return `${hrs}h`;
    else if (!!mins) return `${mins}m`;
    else return `${secs}s`;
  };

  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          className={i < score ? "WeTooCommentCard__stars__active" : ""}
          onClick={() => setScore(i + 1)}
        />
      );
    }
    return <div className="WeTooCommentCard__stars">{stars}</div>;
  };

  const sendReply = () => {
    if (reply.trim().length === 0 || !score) {
      setError(true);
    } else if (!replyLoading) {
      setError(false);
      setReplyLoading(true);
      replyComment(String(id), reply, 1).then((res) => {
        setReplyLoading(false);
        setShowReplyBox(false);
        setData((pre) => ({ ...pre, reply_counter: pre.reply_counter + 1 }));
        if (res.data && replies) {
          setReplies((pre) => [...(pre || []), res.data]);
        }
      });
    }
  };

  const loadReplies = () => {
    setShowReplies((pre) => !pre);
    if (!replies)
      getCommentReplies(String(id)).then((res) => {
        if (res.data) setReplies(res.data);
      });
  };

  return (
    <div className="WeTooCommentCard">
      {profile_image ? (
        <img className="WeTooCommentCard__avatar" src={profile_image} />
      ) : (
        <div className="WeTooCommentCard__namePreview">{profile_name[0]}</div>
      )}
      <div className="WeTooCommentCard__info">
        <div className="WeTooCommentCard__info__comment">
          <div className="WeTooCommentCard__info__name">{profile_name}</div>
          <div className="WeTooCommentCard__info__description">{content}</div>
        </div>
        <div className="WeTooCommentCard__info__reply">
          <div>{calculateTime()}</div>
          <div
            onClick={() => setShowReplyBox(true)}
            className="WeTooCommentCard__info__replyBtn"
          >
            Reply
          </div>
        </div>
        {showReplyBox && (
          <div className="WeTooCommentCard__info__replyBox">
            <Inputs
              isTextArea={true}
              onChange={(v) => setReply(v)}
              type={inputType.text}
              value={reply}
              placeholder="Add Your Reply"
              errorText={
                error && reply.trim().length === 0
                  ? "Please write your reply"
                  : undefined
              }
            />

            {createStars()}
            {!score && error && (
              <small style={{ color: "#d02027", fontSize: "12px" }}>
                Rate This topic
              </small>
            )}
            <Buttons
              className="WeTooCommentCard__info__replyBox__btn"
              label={"Reply"}
              theme={buttonTheme.gradient}
              onClick={sendReply}
              loading={replyLoading}
            />
          </div>
        )}
        <div
          onClick={loadReplies}
          className="WeTooCommentCard__info__replyLink"
        >
          {showReplies ? "Hide" : "View"} {reply_counter} replies
        </div>
        {showReplies &&
          replies?.map((item, index) => (
            <div className="WeTooCommentCard__replyCard" key={index}>
              {item.profile_image ? (
                <img
                  className="WeTooCommentCard__avatar"
                  src={item.profile_image}
                />
              ) : (
                <div className="WeTooCommentCard__namePreview">{item.profile_name[0]}</div>
              )}
              <div className="WeTooCommentCard__replyCard__name">
                {item.profile_name}
              </div>
              <div className="WeTooCommentCard__replyCard__description">
                {item.content}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
