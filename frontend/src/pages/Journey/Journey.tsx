import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { getSearchParam, types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import JourneyContainer from "@/layouts/Journey/JourneyContainer/JourneyContainer";
import { useState } from "react";

const Journey = () => {
  const [searchValue, setSearchValue] = useState(getSearchParam("search"));

  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Journey} searchFunc={setSearchValue} />
          <JourneyContainer searchValue={searchValue} />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Journey;
