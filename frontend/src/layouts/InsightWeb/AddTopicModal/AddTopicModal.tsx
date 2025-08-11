import react, { useContext, useState } from "react";
import "./AddTopicModal.less";
import Title, { size } from "@/components/Title/Title";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import logo from "@/assets/images/logo.png";
import { getFilesBaseOnLanguages } from "../../language/language";
import { Context } from "@/assets/Provider/Provider";

const AddTopicModal = () => {
  const lang = getFilesBaseOnLanguages();
  const { state } = useContext(Context);

  const [type, setType] = useState<number | null>(null);

  return (
    <div className="WeTooAddTopicModal">
      <div className="WeTooAddTopicModal__header" />
      <Title title="Channels" size={size.small} />

      {state.userInfo?.user?.which_type === 0 && (
        <div
          onClick={() => setType(1)}
          className={`WeTooAddTopicModal__item
      ${type === 1 && "WeTooAddTopicModal__item--active"}`}
        >
          <img className="WeTooAddTopicModal__item__img" src={logo} />
          {lang["we_too_association"]}
        </div>
      )}
      <div
        onClick={() => setType(0)}
        className={`WeTooAddTopicModal__item
      ${type === 0 && "WeTooAddTopicModal__item--active"}`}
      >
        <div className="WeTooAddTopicModal__item__icon">+</div>
        {lang["create_new_channel"]}
      </div>

      <div className="WeTooAddTopicModal__btn">
        <Buttons
          label={"Add"}
          theme={buttonTheme.gradient}
          link={`/new-chanel${type ? "?type=admin" : ""}`}
        />
      </div>
    </div>
  );
};

export default AddTopicModal;
