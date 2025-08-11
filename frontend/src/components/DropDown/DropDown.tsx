import { useState } from "react";
import "./DropDown.less";
import chevron from '@/assets/images/smallIcons/rectangle.svg'

const DropDown = (props: {
  placeHolder?: string;
  options: any[];
  optionLabel?: string;
  select: (value: any) => void;
  value?: any;
  label?: string;
}) => {
  const { options, select, optionLabel, placeHolder, value, label } = props;

  const [show, setShow] = useState(false);

  const selectItem = (item: any) => {
    select(item);
    setShow(false);
  };

  return (
    <div className="weTooDropDown">
      {label && <div className="weTooDropDown__label">{label}</div>}
      <div
        onClick={() => setShow((pre) => !pre)}
        className="weTooDropDown__input"
      >
        {value ? (optionLabel ? value[optionLabel] : value) : placeHolder}

        <img src={chevron} className={show ?  'weTooDropDown__input__activeIcon' : ''} />
      </div>
      <div
        className={`weTooDropDown__list ${
          show && "weTooDropDown__list--active"
        }`}
      >
        {options.map((item, index) => (
          <div
            className="weTooDropDown__list__item"
            onClick={() => selectItem(item)}
            key={index}
          >
            {optionLabel ? item[optionLabel] : item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropDown;
