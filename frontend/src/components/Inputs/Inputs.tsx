import "./Inputs.less";
import { useState, useRef, useEffect } from "react";
import { ReactComponent as CloseEye } from "../../assets/images/closeEye.svg";
import { ReactComponent as OpenEye } from "../../assets/images/OpenEye.svg";

export enum inputType {
  text = "text",
  password = "password",
  number = "number",
  email = "email",
}

const Inputs = (props: {
  value: string | number;
  onChange: (value: string) => void;
  onFocus?: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  type: inputType;
  className?: string;
  errorText?: string;
  focus?: boolean;
  isTextArea?: boolean;
}) => {
  const {
    value,
    onChange,
    type,
    label,
    placeholder,
    className,
    errorText,
    focus,
    isTextArea,
  } = props;

  const [showPass, setShowPass] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus) inputRef.current?.focus();
  }, [focus]);

  const inputProps = {
    placeholder: placeholder,
    value: value,
    onChange: (e:any) => onChange(e.target.value),
    className: "WeTooPersianText",
  };

  return (
    <>
      <div
        className={`WeTooInput ${className}
      ${errorText && "WeTooInput--error"}`}
      >
        {label && <label className="WeTooPersianText">{label}</label>}
        <span className="WeTooInput__body">
          {isTextArea ? (
            <textarea {...inputProps} />
          ) : (
            <input
              ref={inputRef}
              {...inputProps}
              type={showPass ? "string" : type}
            />
          )}
          {/* <input
            ref={inputRef}
            type={showPass ? "string" : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="WeTooPersianText"
          /> */}
          {type === "password" &&
            (showPass ? (
              <OpenEye
                onClick={() => setShowPass((pre) => !pre)}
                className="WeTooInput__passIcon"
              />
            ) : (
              <CloseEye
                onClick={() => setShowPass((pre) => !pre)}
                className="WeTooInput__passIcon"
              />
            ))}
        </span>
        {errorText && (
          <small className="WeTooInputError WeTooPersianText">
            {errorText}
          </small>
        )}
      </div>
    </>
  );
};

export default Inputs;
