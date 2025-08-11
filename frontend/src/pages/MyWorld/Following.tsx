import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { getSearchParam, types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import FollowingChannelsList from "@/layouts/MyWorld/FollowingChannelsList/FollowingChannelsList";
import { useState } from "react";

const Following = () => {
  const [searchValue, setSearchValue] = useState(getSearchParam("search"));

  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types["My world"]} searchFunc={setSearchValue} />
          <FollowingChannelsList searchValue={searchValue} />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Following;
