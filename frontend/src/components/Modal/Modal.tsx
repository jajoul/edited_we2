import './Modal.less'

const Modal = (props: {
  content: JSX.Element;
  Close: () => void;
  show: boolean;
  className?: string;
}) => {
  const { content, Close, className, show } = props;

  if (show)
    return (
      <div className={`WeTooModal ${className}`} onClick={Close}>
        <div
          className="WeTooModal__content"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  else return <></>;
};

export default Modal;
