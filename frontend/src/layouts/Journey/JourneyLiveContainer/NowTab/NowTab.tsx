import { useState } from "react";
import "./NowTab.less";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import MainLiveComponent from "./MainLiveComponent/MainLiveComponent";
import { createLive } from "@/assets/Api";
import copyIcon from "@/assets/images/smallIcons/copy.svg";
import { toast } from "react-toastify";
import { history } from "umi";

const NowTab = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState({
    name: "",
    subject: "",
    description: "",
  });

  const updateState = (key: string, value: string) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    setError(false);
  };

  const goNext = () => {
    if (!loading) {
      if (state.description && state.name) {
        setLoading(true);
        createLive(state.name, state.description).then((res) => {
          setLoading(false);
          const room_id = res?.data?.room_id;
          if (!room_id) {
            toast("There is a problem", {
              type: "error",
            });
          } else {
            window.open(
              `http://62-60-164-69.openvidu-local.dev:7443/openvidu-call/${room_id}`
            );
          }
        });
      } else setError(true);
    }
  };

  const dataGetter = (
    <div className="weTooNowTab__body">
      <Inputs
        onChange={(v) => updateState("name", v)}
        label="Live name"
        placeholder="Add live name"
        type={inputType.text}
        value={state.name}
        className="weTooNowTab__body__input"
        errorText={error ? "Enter the name" : undefined}
      />
      {/* <DropDown
        options={["Sub1", "Sub2", "Sub3"]}
        select={(v) => updateState("subject", v)}
        placeHolder="Select subject "
        label="Subject"
        value={state.subject}
      /> */}
      <Inputs
        onChange={(v) => updateState("description", v)}
        type={inputType.text}
        value={state.description}
        label="Description"
        placeholder="Add your description"
        isTextArea
        className="weTooNowTab__body__textArea"
        errorText={error ? "Enter description" : undefined}
      />
      <Buttons
        className="weTooScheduledTab__btn"
        label={"Next step"}
        theme={buttonTheme.gradient}
        onClick={() => goNext()}
        loading={loading}
      />
    </div>
  );

  function copyToClipboard() {
    // Get the text field
    var copyText = document.getElementById("weTooLiveRoomID");

    if (copyText) {
      const value = copyText.innerText;
      const webUrl = location.origin;
      navigator.clipboard.writeText(value);
      toast("Copied to clipboard!", {
        type: "info",
      });
    }
  }

  return (
    <>
      <div className="weTooNowTab">
        {step === 0 ? (
          dataGetter
        ) : (
          <div className="weTooNowTab__mainComponent">
            {/* <MainLiveComponent roomId={room_id} /> */}
            {/* <div className="weTooNowTab__roomId">
              Room ID :&nbsp;
              <span id="weTooLiveRoomID">
                {location.origin}/journey/live?room_id={room_id}
              </span>
              <div onClick={copyToClipboard}>
                <img src={copyIcon} />
              </div>
            </div> */}
          </div>
        )}
      </div>
      <div className="weTooNowTabSteps">
        <div
          className={`weTooNowTabSteps__item ${
            step >= 0 && "weTooNowTabSteps__item--active"
          }`}
        />
        <div
          className={`weTooNowTabSteps__item  ${
            step >= 1 && "weTooNowTabSteps__item--active"
          }`}
        />
      </div>
    </>
  );
};

export default NowTab;
