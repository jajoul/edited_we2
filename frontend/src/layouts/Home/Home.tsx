import PageCover from "../PageCover/PageCover";
import "./Home.less";
import "./Steps/Steps.less";
import HomeCover from "@/assets/images/HomeCover.png";
import { useEffect, useState } from "react";
import HomeLogoView from "./Steps/HomeLogoView";
import Helps from "./Steps/Helps";
import LanguageSelection from "./Steps/LanguageSelection";
import StartPage from "./Steps/StartPage";
import { getFilesBaseOnLanguages } from "../language/language";

const Home = () => {
  const setInitialStep = () => {
    const weTooRepeatedUser = localStorage.getItem("weTooRepeatedUser");
    if (weTooRepeatedUser) {
      return 2;
    } else {
      localStorage.setItem("weTooRepeatedUser", "1");
      return 1;
    }
  };

  const [step, setStep] = useState(0);

  const pages = [
    <HomeLogoView />,
    <Helps goNextStep={() => setStep((pre) => pre + 1)} />,
    <LanguageSelection goNext={() => setStep((pre) => pre + 1)} />,
    <StartPage />,
  ];

  useEffect(() => {
    setTimeout(() => {
      setStep(setInitialStep());
    }, 1000);
  }, []);

  const lang = getFilesBaseOnLanguages();

  return (
    <div className="WeTooHome">
      <PageCover
        imageSrc={HomeCover}
        text={lang["introduce_we2"]}
        className="WeTooHome__pageCover"
      />
      <div className="WeTooHome__info">{pages[step]}</div>
    </div>
  );
};

export default Home;
