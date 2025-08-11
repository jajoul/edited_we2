import React, { useState } from "react";
import "./CreateComment.less";
import { ReactComponent as Like } from "@/assets/images/smallIcons/like.svg";
import Inputs from "@/components/Inputs/Inputs";
import { inputType } from "@/components/Inputs/Inputs";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import { getFilesBaseOnLanguages } from "../../language/language";
import { ReactComponent as Star } from "@/assets/images/smallIcons/star.svg";

const CreateComment = (props: {
  liked?: boolean;
  toggleLike: () => void;
  addComment: (comment: string, score: number) => void;
}) => {
  const { liked, toggleLike, addComment } = props;
  const lang = getFilesBaseOnLanguages();
  const [comment, setComment] = useState("");
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);

  const checkAndSendComment = () => {
    if (comment.trim().length === 0 || !score) {
      setError(true);
    } else {
      setError(false);
      addComment(comment, score);
      setComment("");
      setScore(0)
    }
  };

  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          className={i < score ? "WeTooCreateComment__stars__active" : ""}
          onClick={() => setScore(i + 1)}
        />
      );
    }
    return <div className="WeTooCreateComment__stars">{stars}</div>;
  };

  return (
    <div className="WeTooCreateComment">
      <div className="WeTooCreateComment__header">
        <div>{lang["do_you_liked"]}</div>
        <Like
          onClick={toggleLike}
          className={`WeTooCreateComment__header--like
        ${!liked && "WeTooCreateComment__header--unlike"}`}
        />
      </div>
      <div className="WeTooCreateComment__body">
        <Inputs
          isTextArea={true}
          onChange={(v) => setComment(v)}
          type={inputType.text}
          label={lang["leaving_comment"]}
          value={comment}
          placeholder={lang["comment_placeholder"]}
          errorText={
            error && comment.trim().length === 0
              ? "Please add a comment"
              : undefined
          }
        />

        {createStars()}
        {error && !score && (
          <small style={{ color: "#d02027", fontSize: "12px" }}>
            Rate This topic
          </small>
        )}

        <Buttons
          className="WeTooCreateComment__body__btn"
          label={lang["submit"]}
          theme={buttonTheme.gradient}
          onClick={checkAndSendComment}
        />
      </div>
    </div>
  );
};

export default CreateComment;
