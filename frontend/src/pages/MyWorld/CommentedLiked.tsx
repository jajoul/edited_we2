import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { getSearchParam, types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import CommentedList from "@/layouts/MyWorld/CommentedList/CommentedList";
import { useState } from "react";

const CommentedLiked = () => {
  const [searchValue, setSearchValue] = useState(getSearchParam("search"));

  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types["My world"]} searchFunc={setSearchValue} />
         <CommentedList searchValue={searchValue} />
        </div>
      </div>
    </CheckLogin>
  );
};

export default CommentedLiked;
