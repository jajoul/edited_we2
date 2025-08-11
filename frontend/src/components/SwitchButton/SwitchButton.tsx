import "./SwitchButton.less";

const SwitchButton = (props: { onChange: (checked: boolean) => void, checked?:boolean }) => {
  const uniqueId = String(Math.random());
  const { onChange , checked} = props;

  return (
    <>
      <input
        onChange={(e) => onChange(e.target.checked)}
        id={uniqueId}
        className="WeTooSwitchButtonInput"
        type="checkbox"
        checked={checked}
      />
      <label htmlFor={uniqueId} className="WeTooSwitchButton"></label>
    </>
  );
};

export default SwitchButton;
