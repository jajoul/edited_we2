import PageCover from "@/layouts/PageCover/PageCover";
import WeTooLoginCoverPage from "@/assets/images/WeTooLoginCoverPage.png";
import SignUpForm from "@/layouts/SignUp/SignUpForm";
import "./SignUp.less";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";
import CheckLogin from "@/assets/Hooks/CheckLogin";

const SignUp = () => {
  const lang = getFilesBaseOnLanguages();

  return (
    <CheckLogin notLoginForShow={true}>
      <div className="WeTooSignUp">
        <PageCover
          imageSrc={WeTooLoginCoverPage}
          text={lang["introduce_we2"]}
          className="WeTooSignUp__pageCover"
        />
        <SignUpForm />
      </div>
    </CheckLogin>
  );
};

export default SignUp;
