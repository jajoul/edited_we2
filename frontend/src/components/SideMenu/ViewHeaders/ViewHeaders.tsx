import arrowLeft from "@/assets/images/arrow-left.svg";
import "./ViewHeaders.less";

const ViewHeaders = (props: { title: string; goHome: () => void, close:() => void , className?:string}) => {
  const { title, goHome, close, className } = props;

  return (
    <div className={`WeTooViewHeader ${className}`}>
      <div className="WeTooViewHeader__backIcon" onClick={goHome}>
        <img src={arrowLeft} />
      </div>
      <div className="WeTooViewHeader__title">{title}</div>
      <div className="WeTooViewHeader__closeIcon" onClick={close}>×</div>
    </div>
  );
};

export default ViewHeaders;
