import React, { useContext, useEffect } from "react";
import Logo from "../../../assets/images/logo.png";
import whiteLogo from "../../../assets/images/logo-white.svg";
import { CHANGE_LANGUAGE, EN } from "@/assets/Provider/types";
import { FA } from "@/assets/Provider/types";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import irFlag from "../../../assets/images/ir.png";
import ukFlag from "../../../assets/images/uk.png";
import { Context } from "@/assets/Provider/Provider";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";

const LanguageSelection = (props: { goNext: () => void }) => {
  const goNext = props.goNext;

  const { dispatch, state } = useContext(Context);

  // Ensure a default language is selected
  useEffect(() => {
    console.log("LanguageSelection: Current language state:", state.lng);
    if (!state.lng) {
      console.log("LanguageSelection: No language selected, setting default to EN");
      dispatch({ type: CHANGE_LANGUAGE, data: { lng: EN } });
    }
  }, [state.lng, dispatch]);

  const languages = [
    {
      title: "International",
      flag: ukFlag,
      label: "English",
      value: EN,
      example: "Eng",
    },
    {
      title: "Iran",
      flag: irFlag,
      label: "Farsi",
      value: FA,
      example: "فارسی",
    },
  ];

  const selectLng = (lng: string) => {
    console.log("LanguageSelection: User selected language:", lng);
    dispatch({ type: CHANGE_LANGUAGE, data: { lng } });
  };

  const handleNext = () => {
    console.log("LanguageSelection: Next button clicked, current language:", state.lng);
    // Ensure a language is selected before proceeding
    if (state.lng) {
      goNext();
    } else {
      console.log("LanguageSelection: No language selected, cannot proceed");
    }
  };

  const lang = getFilesBaseOnLanguages();

  return (
    <div className="WeTooLanguageSelection">
      <div className="WeTooLanguageSelection__body">
        <picture>
          <source media="(max-width: 767px)" srcSet={whiteLogo} />
          <source media="(min-width: 768px)" srcSet={Logo} />
          <img
            className="WeTooLanguageSelection__image"
            src={Logo}
            alt="logo"
          />
        </picture>
        <div className="WeTooLanguageSelection__box">
          <div className="WeTooLanguageSelection__box__title WeTooPersianText">
            {lang["select_language"]}
          </div>
          {languages.map((item, index) => (
            <div
              onClick={() => selectLng(item.value)}
              className={`WeTooLanguageSelection__box__item
          ${
            state.lng === item.value &&
            "WeTooLanguageSelection__box__item--active"
          }`}
              key={index}
            >
              <div className="WeTooLanguageSelection__box__container">
                <div className="WeTooLanguageSelection__box__subTitle">
                  <span />
                  {item.title}
                </div>
                <div className="WeTooLanguageSelection__box__label">
                  {item.label}
                </div>
                <div className="WeTooLanguageSelection__box__example">
                  {item.example}
                </div>
              </div>
              <img
                className="WeTooLanguageSelection__box__flag"
                src={item.flag}
              />
            </div>
          ))}

          <Buttons
            className="WeTooLanguageSelection__box__btn"
            label={lang["next"]}
            theme={buttonTheme.gradient}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
