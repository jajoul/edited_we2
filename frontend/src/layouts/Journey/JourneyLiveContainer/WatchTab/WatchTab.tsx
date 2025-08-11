import { useState } from "react";
import "./WatchTab.less";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import MainLiveComponent from "../NowTab/MainLiveComponent/MainLiveComponent";
import { history } from "umi";

const WatchTab = () => {
  // const navigate = Navigate()
  const getSelectedTab = () => {
    const search = location.search;
    if (search.includes("room_id")) {
      const id = search.split("=");
      return {
        roomId: id[1],
        step: 2,
      };
    } else {
      return {
        roomId: "",
        step: 1,
      };
    }
  };

  const [roomId, setRoomId] = useState(getSelectedTab().roomId);
  const [step, setStep] = useState(getSelectedTab().step);
  const [err, setErr] = useState(false);

  const watch = () => {
    if (roomId) {
      setStep(2);
      history.push(`/journey/live?room_id=${roomId}`);
    } else setErr(true);
  };

  return (
    <div className="WeTooWatchTab">
      {step === 1 ? (
        <div className="WeTooWatchTab__body">
          <Inputs
            onChange={(v) => setRoomId(v)}
            type={inputType.text}
            label="Room Id"
            placeholder="Enter Your Room Id"
            value={roomId}
            errorText={err && !roomId ? "Enter Room Id" : undefined}
          />
          <Buttons
            label={"Watch"}
            theme={buttonTheme.gradient}
            onClick={watch}
            className="WeTooWatchTab__btn"
          />
        </div>
      ) : (
        <>
          <MainLiveComponent rtpCapabilities={{}} roomId={roomId} viewer />
        </>
      )}
    </div>
  );
};

export default WatchTab;
