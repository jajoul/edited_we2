import LoginCoverImage from "@/assets/images/WeTooLoginCoverPage.png";
import { ReactComponent as UKFlag } from "../../assets/images/UKFlag.svg";
import "./Login.less";
import irFlag from "../../assets/images/ir.png";

import Form from "@/layouts/Login/LoginForm";
import PageCover from "@/layouts/PageCover/PageCover";
import Title from "@/components/Title/Title";
import { getFilesBaseOnLanguages } from "../../layouts/language/language";
import CheckLogin from "@/assets/Hooks/CheckLogin";
import { useContext } from "react";
import { Context } from "@/assets/Provider/Provider";

const Login = () => {
  const lang = getFilesBaseOnLanguages();
  const context = useContext(Context);

  return (
    <CheckLogin notLoginForShow={true}>
      <div className="WeTooLogin">
        <div className="WeTooLogin__mobileTopBackground">
          <div className="WeTooLogin__mobileTopBackground__header"></div>
          <div className="WeTooLogin__mobileTopBackground__image"></div>
        </div>
        <PageCover
          imageSrc={LoginCoverImage}
          text={lang["introduce_we2"]}
          text_className="WeTooPersianText"
          className="WeTooLogin__pageCover"
        />
        <div className="WeTooLogin__formContainer">
          {context.state.lng === 'fa' ? <img src={irFlag} className="WeTooLogin__flag"/> :  <UKFlag className="WeTooLogin__flag" />}
          <Title
            className="WeTooPersianText WeTooLogin__titleColor"
            title={lang["sign_in"]}
          />
          <Form />
        </div>
      </div>
    </CheckLogin>
  );
};

export default Login;
