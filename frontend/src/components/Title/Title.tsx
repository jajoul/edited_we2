import React from "react";
import "./Title.less";

export enum size {
  small = "small",
}

const Title = (props: { title: string; className?: string; size?: size }) => {
  const { title, className, size } = props;

  return (
    <h3 className={`WeTooTitle WeTooTitle--${size} ${className}`}>{title}</h3>
  );
};

export default Title;
