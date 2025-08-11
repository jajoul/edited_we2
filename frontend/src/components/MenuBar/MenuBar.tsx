import React, { ChangeEvent, useContext, useState } from "react";
import "./MenuBar.less";
import earth from "../../assets/images/smallIcons/earth.svg";
import home from "../../assets/images/smallIcons/home.svg";
import person from "../../assets/images/smallIcons/person.svg";
import search from "../../assets/images/smallIcons/search.svg";
import { Link, history } from "umi";
import { Context } from "@/assets/Provider/Provider";
import { SAVE_CURRENT_PAGE } from "@/assets/Provider/types";
import { getFilesBaseOnLanguages } from "../../layouts/language/language";

export enum types {
  Insight = 1,
  Journey = 2,
  "My world" = 3,
}

export const getSearchParam = (key: string) => {
  let params = new URL(document.location.href).searchParams;
  const value = params.get(key);
  return value || "";
};

const MenuBar = (props: {
  activeId?: types;
  searchFunc?: (value: string) => void;
}) => {
  const { activeId } = props;

  const lang = getFilesBaseOnLanguages();

  const { dispatch, state } = useContext(Context);
  const [searchValue, setSearchValue] = useState(
    getSearchParam("value") || getSearchParam("search")
  );

  const options = [
    {
      name: lang["insight"],
      logo: home,
      link: "/insight-web",
      type: types.Insight,
    },
    {
      name: lang["journey"],
      logo: earth,
      link: "/journey",
      type: types.Journey,
    },
    {
      name: lang["my_world"],
      logo: person,
      link: "/my-world",
      type: types["My world"],
    },
  ];

  const changePage = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    const currentPage = history.location?.pathname;
    if (state.page === null)
      dispatch({ type: SAVE_CURRENT_PAGE, data: { page: currentPage } });

    if (activeId === types.Insight) {
      history.push(`/insight-web/search?value=${value}`);
    } else {
      if (value.trim().length > 0)
        history.push(`${history.location.pathname}?search=${value}`);
      else history.push(`${history.location.pathname}`);
    }

    if (props.searchFunc) props.searchFunc(value);
  };

  const resetSearchAndBack = () => {
    const preUrl = state.page;
    if (preUrl) history.push(preUrl);
    setSearchValue("");
    dispatch({ type: SAVE_CURRENT_PAGE, data: { page: null } });
    if (props.searchFunc) props.searchFunc('');
  };

  return (
    <div className="WeTooMenuBar">
      <span className="WeTooMenuBar__inputContainer">
        <img src={search} className="WeTooMenuBar__searchIcon" />
        <input
          onChange={changePage}
          placeholder="Search"
          className="WeTooMenuBar__input"
          value={searchValue || ""}
          autoFocus={!!searchValue}
        />
        {searchValue && (
          <div
            onClick={resetSearchAndBack}
            className="WeTooMenuBar__cancelIcon"
          />
        )}
      </span>
      <div className="WeTooMenuBar__title">{lang["menu"]}</div>
      <div className="WeTooMenuBar__list">
        {options.map((item) => (
          <Link
            to={item.link}
            className={`WeTooMenuBar__list__item 
          ${item.type === activeId && "WeTooMenuBar__list__item--active"}
          `}
            key={item.name}
          >
            <img className="WeTooMenuBar__list__img" src={item.logo} />
            <div className="WeTooMenuBar__list__label">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;
