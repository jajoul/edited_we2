import Nav from "@/components/Nav/Nav";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import InsightWebSearchContainer from "@/layouts/InsightWebSearch/InsightWebSearchContainer";
import CheckLogin from "@/assets/Hooks/CheckLogin";
import { useState } from "react";

const InsightWebSearch = () => {
  const [searchValue , setSearchValue] = useState('')

  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide={true} />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} searchFunc={setSearchValue} />
          <InsightWebSearchContainer searchValue={searchValue}  />
        </div>
      </div>
    </CheckLogin>
  );
};

export default InsightWebSearch;
