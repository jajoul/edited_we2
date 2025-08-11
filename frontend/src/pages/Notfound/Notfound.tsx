import React from "react";
import "./NotFound.less";

const Notfound = () => {
  return (
    <div className="WeTooNotFound">
      <div className="WeTooNotFound__404">
        <h1>:(</h1>
      </div>
      <div className="WeTooNotFound__container">
        <h2>404 - Page not found</h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <a href="/">home page</a>
      </div>
    </div>
  );
};

export default Notfound;
