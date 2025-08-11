import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { getSearchParam, types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import MyWorldContainer from "@/layouts/MyWorld/MyWorldContainer/MyWorldContainer";
import ProfileLogoNav from "@/layouts/MyWorld/MyWorldContainer/ProfileLogoNav/ProfileLogoNav";
import { useState } from "react";

const MyWorld = () => {
  const [searchValue, setSearchValue] = useState(getSearchParam("search"));

  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide />
        <ProfileLogoNav mobileShow />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types["My world"]} searchFunc={setSearchValue} />
          <MyWorldContainer searchValue={searchValue} />
        </div>
      </div>
    </CheckLogin>
  );
};

export default MyWorld;
