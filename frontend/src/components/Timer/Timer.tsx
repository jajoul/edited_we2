import React, { useEffect, useState } from 'react'
import Buttons, { buttonTheme } from '../Buttons/Buttons';



const Timer = (props: {
    time: number
}) => {

    const { time } = props

    const [timer, setTimer] = useState(time);
    const [resend, setResend] = useState(false);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(countdownInterval);
        };
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setResend(true);
        }
    }, [timer]);

    const resendCode = () => {
        setResend(false);
        setTimer(time)
    }

    return (
        <div className='weTooChangePasswordOTP__timer'>
            {resend ? (
                <Buttons
                    className="weTooChangePasswordOTP__btn"
                    onClick={resendCode}
                    label={"Resend"}
                    theme={buttonTheme.gradient}
                />) : (
                <div className="WeTooStepTwoForm__countdown">
                    00:{timer.toString().padStart(2, "0")}
                </div>
            )}
        </div>
    )
}

export default Timer
