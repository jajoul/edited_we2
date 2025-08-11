import CheckLogin from "@/assets/Hooks/CheckLogin";
import MenuBar, { types } from "@/components/MenuBar/MenuBar";
import Nav from "@/components/Nav/Nav";
import JourneyLiveContainer from "@/layouts/Journey/JourneyLiveContainer/JourneyLiveContainer";

const JourneyLive = () => {
  return (
    <CheckLogin>
      <div className="WeTooMainContainer">
        <Nav />
        <div className="WeTooMainContainer__body">
          <MenuBar activeId={types.Journey} />
          <JourneyLiveContainer />
        </div>
      </div>
    </CheckLogin>
  );
};

export default JourneyLive;
