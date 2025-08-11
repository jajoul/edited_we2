import React from "react";
import "./PageTemplate.less";
import arrowLeft from "@/assets/images/arrow-left.svg";
import { Link } from "umi";

const PageTemplate = (props: {
  pageTitle: string;
  titleLink?: string;
  children: JSX.Element;
  className?: string;
}) => {
  const { pageTitle, children, className, titleLink } = props;

  return (
    <div
      className={`WeTooPageTemplate WeTooMainContainer__contentContainer ${className}`}
    >
      <div className="WeTooPageTemplate__body">
        <div className="WeTooPageTemplate__title">
          <div
            onClick={() => window.history.go(-1)}
            className="WeTooPageTemplate__backBtn"
          >
            <img src={arrowLeft} />
          </div>
          {titleLink ? (
            <Link to={titleLink}>{pageTitle}</Link>
          ) : (
            <>{pageTitle}</>
          )}
        </div>
        <div className="WeTooPageTemplate__box">{children}</div>
      </div>
    </div>
  );
};

export default PageTemplate;
