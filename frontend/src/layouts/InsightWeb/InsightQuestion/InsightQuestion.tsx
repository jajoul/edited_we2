import Title, { size } from "@/components/Title/Title";
import React, { ChangeEvent, useContext, useState } from "react";
import "./InsightQuestion.less";
import Buttons from "@/components/Buttons/Buttons";
import { buttonTheme } from "@/components/Buttons/Buttons";
import questionmark from "@/assets/images/smallIcons/questionmark.svg";
import { Context } from "@/assets/Provider/Provider";
import { answerDailyQuestion } from "@/assets/Api";
import { toast } from "react-toastify";
import { getFilesBaseOnLanguages } from "../../language/language";
import { SET_QUESTION } from "@/assets/Provider/types";

const InsightQuestion = (props: { mobileHide?: boolean }) => {
  const { mobileHide } = props;
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState({
    content: "",
    number: "",
  });

  const lang = getFilesBaseOnLanguages();

  const answers = [
    { answer: state?.question?.opt1_statement },
    { answer: state?.question?.opt2_statement },
    { answer: state?.question?.opt3_statement },
    { answer: state?.question?.opt4_statement },
  ];

  const selectAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.getAttribute("content");
    const id = e.target.getAttribute("id")?.replace("--", "");
    setSelectedAnswer({ content: answer || "", number: id || "" });
  };

  const sendAnswer = () => {
    if (selectedAnswer && !loading && selectedAnswer.number) {
      setLoading(true);
      answerDailyQuestion({
        content: selectedAnswer.content,
        question_id: state.question?.id || "",
        which_option: selectedAnswer.number,
      }).then((res) => {
        setLoading(false);
        if (res.status === 201) {
          dispatch({ type: SET_QUESTION, data: { question: undefined } });
          toast(`${lang["question_answer_success_toast_msg"]}`, {
            type: "success",
          });
        }
      });
    }
  };

  return (
    <div
      className={`WeTooInsightQuestion ${
        mobileHide && "WeTooInsightQuestion--mobileHide"
      }`}
    >
      {state.question && (
        <>
          <Title
            className="WeTooInsightQuestion__title"
            title="Daily Questions"
            size={size.small}
          />
          <div className="WeTooInsightQuestion__questionBox">
            <p className="WeTooInsightQuestion__questionBox__question">
              {state?.question?.ques_statement}
            </p>
            <div className="WeTooInsightQuestion__questionBox__answers">
              {answers.map((item, index) => (
                <div
                  className="WeTooInsightQuestion__questionBox__answer"
                  key={index}
                >
                  <input
                    name="WeTooInsightQuestion"
                    id={`--${index + 1}`}
                    type="radio"
                    onChange={selectAnswer}
                    content={item.answer}
                  />
                  <label htmlFor={`--${index + 1}`}>{item.answer}</label>
                </div>
              ))}
            </div>
            <Buttons
              label="Confirm"
              className="WeTooInsightQuestion__questionBox__btn"
              theme={buttonTheme.gradient}
              onClick={sendAnswer}
              loading={loading}
              disable={!!state.questionStatus}
            />
            <img
              src={questionmark}
              className="WeTooInsightQuestion__questionBox__bgImg"
            />
          </div>
        </>
      )}

      {state.ads && state.ads.length > 0 && <div className="WeTooInsightQuestion__imgList">
        {state.ads?.map((item) => (
          <a
            target="_blank"
            className="WeTooInsightQuestion__imgList__image"
            href={item.url}
            key={item.id}
          >
            <img src={item.image} />
          </a>
        ))}
      </div>}
    </div>
  );
};

export default InsightQuestion;
