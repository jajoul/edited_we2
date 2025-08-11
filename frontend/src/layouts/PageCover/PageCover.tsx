import { Link } from "umi";
import { ReactComponent as LogoWhite } from "../../assets/images/logo-white.svg";

import "./PageCover.less";

const PageCover = (props: {
  imageSrc: string;
  text: string;
  className?: string;
  text_className?: string;
}) => {
  const { imageSrc, className, text } = props;

  return (
    <div className={`WeTooPageCover ${className}`}>
      <Link to="/">
        <LogoWhite className="WeTooPageCover__logo" />
      </Link>
      <img src={imageSrc} className="WeTooPageCover__pageCover" />
      <p
        className={`WeTooPageCover__CoverText WeTooPersianText--center ${props.text_className}`}
      >
        {text}
      </p>
    </div>
  );
};

export default PageCover;
