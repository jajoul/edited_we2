import React, { useState } from "react";
import "./OTP.less";

const OTPComponent = (props: {
  className?: string;
  handleChange?: (otpCode: number) => void;
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Handle OTP input change for each digit
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputOTP = e.target.value;
    const newOTP = [...otp];
    newOTP[index] = inputOTP;
    setOtp(newOTP);

    if (props.handleChange) {
      const code = newOTP.join("");
      props.handleChange(Number(code));
    }

    // Focus the next input field, if available
    if (index < 5 && inputOTP !== "") {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className={`WeTooOTPComponent ${props.className}`}>
      {otp.map((digit, index) => (
        <input
          className="WeTooOTPComponent__input"
          type="number"
          id={`otp-${index}`}
          key={index}
          value={digit}
          onChange={(e) => handleInputChange(e, index)}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OTPComponent;
