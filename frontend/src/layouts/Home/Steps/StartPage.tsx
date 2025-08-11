import React, { useContext, useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import whiteLogo from "../../../assets/images/logo-white.svg";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import { EN, FA } from "@/assets/Provider/types";
import irFlag from "../../../assets/images/ir.png";
import ukFlag from "../../../assets/images/uk.png";
import { Context } from "@/assets/Provider/Provider";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";

const StartPage = () => {
  const { state } = useContext(Context);

  const flags = {
    [EN]: ukFlag,
    [FA]: irFlag,
  };

  const lang = getFilesBaseOnLanguages();

  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = () => {
    if (window.innerWidth < 768 && !isMobile) setIsMobile(true);
    else if (isMobile) setIsMobile(false);
  };

  useEffect(() => {
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
  }, []);

  return (
    <div className="WeTooStartPage">
      <div className="WeTooStartPage__body">
        <img src={flags[state.lng]} className="WeTooStartPage__flag" />
        {/* <img src={logo} className="WeTooStartPage__image" /> */}
        <picture className="WeTooStartPage__image">
          <source media="(max-width: 767px)" srcSet={whiteLogo} />
          <source media="(min-width: 768px)" srcSet={logo} />
          <img className="WeTooStartPage__image" src={logo} alt="logo" />
        </picture>

        <h1 className="WeTooStartPage__title WeTooPersianText">
          {lang["introduction_title"]}
        </h1>
        <p className="WeTooStartPage__paragraph WeTooPersianText">
          {lang["introduce_we2"]}
        </p>
        <Buttons
          label={lang["sign_in"]}
          theme={isMobile ? buttonTheme.white : buttonTheme.gradient}
          className="WeTooStartPage__btn"
          link="/login"
        />
        <Buttons
          label={lang["sign_up"]}
          theme={
            isMobile
              ? buttonTheme.transparentWhite
              : buttonTheme.transparentPurple
          }
          className="WeTooStartPage__btn"
          link="/signup"
        />
      </div>
    </div>
  );
};

export default StartPage;
