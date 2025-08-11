import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import NewTopicContainer from "@/layouts/NewTopic/NewTopicContainer";

const NewTopic = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav mobileHide={true} />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Insight} />
          <NewTopicContainer />
        </div>
      </div>
    </CheckLogin>
  );
};

export default NewTopic;
