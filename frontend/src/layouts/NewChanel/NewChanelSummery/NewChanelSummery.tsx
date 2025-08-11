import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import PageTemplate from "../PageTemplate/PageTemplate";
import ChannelHeader from "./ChannelHeader/ChannelHeader";
import "./NewChanelSummery.less";
import { dataType } from "../InitialDataGetter/InitialDataGetter";
import { getFilesBaseOnLanguages } from "../../language/language";
import { history } from "umi";

const NewChanelSummery = (props: {
  data: dataType;
  setSummery: (show: boolean) => void;
}) => {
  const { data, setSummery } = props;
  const lang = getFilesBaseOnLanguages();

  const goToEdit = () => {
    history.push(`/new-chanel/${data.id || ''}`)
    setSummery(false)
  }

  return (
    <PageTemplate
      children={
        <>
          <ChannelHeader
            avatar={
              typeof data.image === "string" ? data.image : data.image?.base64
            }
            id={data.id || ""}
            EditFunction={goToEdit}
            CanEdit={true}
          />
          <div className="WeTooNewChanelSummery__textContainer">
            <h4 className="WeTooNewChanelSummery__title">{lang["about"]}</h4>
            <p className="WeTooNewChanelSummery__description">{data.about}</p>
            <h4 className="WeTooNewChanelSummery__title">{lang["topics"]}</h4>
          </div>
          <p className="WeTooNewChanelSummery__description WeTooNewChanelSummery__description--center">
            {lang["no_topics"]}
          </p>
          <Buttons
            className="WeTooNewChanelSummery__btn"
            label={"Create"}
            theme={buttonTheme.gradient}
            link={`/new-topic/${data.id}`}
          />
        </>
      }
      pageTitle={lang["create_new_channel"]}
      className="WeTooNewChanelSummery"
    />
  );
};

export default NewChanelSummery;
