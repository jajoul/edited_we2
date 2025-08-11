import ViewHeaders from "../ViewHeaders/ViewHeaders";
import phoneIcon from "@/assets/images/smallIcons/Phone.svg";
import message from "@/assets/images/smallIcons/message.svg";
import location from "@/assets/images/smallIcons/location.svg";
import "./Support.less";

const Support = (props: {
  setView: (viewId: number) => void;
  close: () => void;
}) => {
  const { setView, close } = props;

  const supportData = [
    { icon: phoneIcon, data: "09123456789" },
    { icon: message, data: "09123456789" },
    {
      icon: location,
      data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
  ];

  return (
    <>
      <ViewHeaders goHome={() => setView(1)} title="Support" close={close} />
      <div className="weTooSupportList">
        {supportData.map((item, index) => (
          <div className="weTooSupportList__item" key={index}>
            <div className="weTooSupportList__item__img">
              <img src={item.icon} />{" "}
            </div>
            <div className="weTooSupportList__item__content"> {item.data} </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Support;
