import Inputs, { inputType } from "@/components/Inputs/Inputs";
import "./QuestionCard.less";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import questionmark from "@/assets/images/smallIcons/questionmark.svg";

const QuestionCard = (props: {
  data: {
    id: number;
    mode: string;
    opt1_statement: string;
    opt2_statement: string;
    opt3_statement: string;
    opt4_statement: string;
    ques_statement: string;
  };
}) => {
  const { data } = props;

  const answer = (answer: string, id: string, name: string | number) => (
    <div className="weTooPersonalQuestionCard__answerContainer">
      <input name={String(name)} id={id} type="radio" />
      <label htmlFor={id} className="weTooPersonalQuestionCard__answer">
        {answer}
      </label>
    </div>
  );

  const body = () => {
    switch (data.mode) {
      case "4_opt":
        return (
          <>
            {answer(data.opt1_statement, data.id + "1", data.id)}
            {answer(data.opt2_statement, data.id + "2", data.id)}
            {answer(data.opt3_statement, data.id + "3", data.id)}
            {answer(data.opt4_statement, data.id + "4", data.id)}
          </>
        );
      case "2_opt":
        return (
          <>
            {answer(data.opt1_statement, data.id + "1", data.id)}
            {answer(data.opt2_statement, data.id + "2", data.id)}
          </>
        );
      case "text":
        return (
          <Inputs
            placeholder="Answer"
            onChange={(v) => { }}
            value={""}
            type={inputType.text}
          />
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="weTooPersonalQuestionCard">

      <div className="weTooPersonalQuestionCard__box">
        <div className="weTooPersonalQuestionCard__question">
          {data.ques_statement}
        </div>
        <div
          className={`weTooPersonalQuestionCard__body
        ${data.mode === "4_opt" && "weTooPersonalQuestionCard__body--half"}`}
        >
          {body()}
        </div>
        <Buttons
          className="weTooPersonalQuestionCard__btn"
          label={"Confirm"}
          theme={buttonTheme.gradient}
        />

        <img src={questionmark} className="weTooPersonalQuestionCard__img" />
      </div>
    </div>
  );
};

export default QuestionCard;
