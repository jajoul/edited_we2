import "./Spinner.less";

const Spinner = (props: { className?: string; width?: string, purple?:boolean }) => {
  const { className, width, purple } = props;

  return (
    <div className={`${className} WeTooLoader ${purple ? 'WeTooLoader--purple' : ''}`} style={{ width: width }}></div>
  );
};

export default Spinner;
