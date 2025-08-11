import React from "react";
import BackgroundHeader from "@/assets/images/BackgroundHeader.png";
import logo from "@/assets/images/logo.png";
import BlueEdit from "@/assets/images/smallIcons/BlueEdit.svg";
import "./ChannelHeader.less";
import { Link } from "umi";
import { getFilesBaseOnLanguages } from "../../../language/language";

const ChannelHeader = (props: {
  avatar?: string;
  id: string | number;
  EditFunction?: () => void;
  number_of_members?: number;
  className?: string;
  CanEdit?: boolean;
}) => {
  const { avatar, id, EditFunction, number_of_members, className, CanEdit } =
    props;
  const lang = getFilesBaseOnLanguages();

  const goToEdit = () => {
    if (EditFunction) EditFunction();
  };

  return (
    <div className={`WeTooChannelHeader ${className}`}>
      <img className="WeTooChannelHeader__image" src={BackgroundHeader} />
      <div
        className={`WeTooChannelHeader__avatar 
          ${!avatar && "WeTooChannelHeader__avatar--empty"}`}
      >
        <img src={avatar || logo} />
        <div className="WeTooChannelHeader__avatar__text">
          {number_of_members || 0} {lang["follower"]}
        </div>
      </div>
      {CanEdit && (
        <Link
          onClick={goToEdit}
          to={`/new-chanel/${id || ""}`}
          className="WeTooChannelHeader__editBtn"
        >
          <img src={BlueEdit} />
        </Link>
      )}
    </div>
  );
};

export default ChannelHeader;
