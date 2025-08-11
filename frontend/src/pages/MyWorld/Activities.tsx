import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { getSearchParam, types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import ActivitiesList from "@/layouts/MyWorld/ActivitiesList/ActivitiesList";
import { useState } from "react";

const Activities = () => {
  const [searchValue, setSearchValue] = useState(getSearchParam("search"));

  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types["My world"]} searchFunc={setSearchValue} />
          <ActivitiesList  searchValue={searchValue}  />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Activities;
