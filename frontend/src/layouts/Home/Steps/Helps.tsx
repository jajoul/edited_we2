import React, { useState } from "react";
import { ReactComponent as ArrowLeft } from "../../../assets/images/arrow-left.svg";
import { ReactComponent as ChevronRight } from "../../../assets/images/chevron-right.svg";
import StepViewer from "../../SignUp/StepViewer/StepViewer";
import Buttons from "@/components/Buttons/Buttons";
import { buttonTheme } from "@/components/Buttons/Buttons";

import main1 from "../../../assets/images/main1.png";
import main2 from "../../../assets/images/main2.png";
import main3 from "../../../assets/images/main3.png";

import { getFilesBaseOnLanguages } from "../../language/language";

const Helps = (props: { goNextStep: () => void }) => {
  const lang = getFilesBaseOnLanguages();
  const { goNextStep } = props;

  const [step, setStep] = useState(0);

  const data = [
    {
      image: main1,
      description: lang["issue_description"],
      title: lang["issue_title"],
    },
    {
      image: main2,
      description: lang["solution_description"],
      title: lang["solution_title"],
    },
    {
      image: main3,
      description: lang["introduce_description"],
      title: lang["introduction_title"],
    },
  ];

  const goPre = () => {
    setStep((pre) => Math.max(0, pre - 1));
  };

  const goNext = () => {
    if (step >= 2) {
      goNextStep();
    } else {
      setStep((pre) => Math.min(2, pre + 1));
    }
  };

  return (
    <div className="WeTooHelps">
      <ArrowLeft
        onClick={goPre}
        className={`WeTooHelps__backBtn 
        ${step === 0 && "WeTooHelps__backBtn--hide"}`}
      />

      <div className="WeTooHelps__body">
        <img className="WeTooHelps__image" src={data[step]?.image} />
        <h2 className="WeTooHelps__title">{data[step]?.title}</h2>
        <p className="WeTooHelps__description">{data[step]?.description}</p>
        <StepViewer
          className="WeTooHelps__stepView"
          selectedStep={step + 1}
          stepNumber={3}
        />
      </div>
      <Buttons
        onClick={goNext}
        className="WeTooHelps__btn"
        label={<ChevronRight />}
        theme={buttonTheme.gradient}
      />
    </div>
  );
};

export default Helps;
