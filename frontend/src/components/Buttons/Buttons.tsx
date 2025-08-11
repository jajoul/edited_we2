import { Link } from "umi";
import "./Buttons.less";
import { MouseEvent, MouseEventHandler } from "react";
import Spinner from "../Spinner/Spinner";

export enum buttonTheme {
  "transparentWhite" = 1,
  "transparentPurple" = 2,
  "white" = 3,
  "gradient" = 4,
}

export interface buttonProps {
  label: string | JSX.Element;
  theme: buttonTheme;
  className?: string;
  link?: string;
  onClick?: () => void;
  loading?: boolean;
  disable?: boolean;
}

const Buttons = (props: buttonProps) => {
  const { label, theme, className, link, onClick, loading, disable } = props;

  const provider = (child: JSX.Element) =>
    link ? (
      <Link className="WeTooBtnLink" to={link}>
        {child}
      </Link>
    ) : (
      child
    );

  const clickFunc = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick();
  };

  return provider(
    <button
      disabled={disable}
      className={`WeTooBtn  WeTooPersianText--center
      ${className}
      ${disable && 'WeTooBtn--disable'}
      ${theme === buttonTheme.transparentWhite && "WeTooBtn--transparentWhite"}
      ${
        theme === buttonTheme.transparentPurple && "WeTooBtn--transparentPurple"
      }
      ${theme === buttonTheme.white && "WeTooBtn--white"}`}
      onClick={(e) => clickFunc(e)}
    >
      {loading && <Spinner className="WeTooBtn__spinner" width="15px" />}
      {label}
    </button>
  );
};

export default Buttons;
