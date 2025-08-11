import SwitchButton from "@/components/SwitchButton/SwitchButton";
import { useEffect, useState } from "react";
import "./TopicAddition.less";
import { getFilesBaseOnLanguages } from "../../language/language";

const TopicAddition = (props: {
  setShowAdditionModal: (show: boolean) => void;
  additions?: {
    [key: string]: {
      icon: string;
      title: string;
      preview: JSX.Element;
      value?: any;
    };
  };
  setData: (data: any) => void;
}) => {
  const { setShowAdditionModal, additions } = props;
  const [useAddition, setUseAddition] = useState(false);
  const lang = getFilesBaseOnLanguages();

  useEffect(() => {
    if (
      additions &&
      (!!additions.picture?.value ||
        !!additions.video?.value ||
        !!additions.pdf?.value) &&
      !useAddition
    )
      setUseAddition(true);
  }, [additions, additions?.picture, additions?.video, additions?.pdf]);

  const removeAttachment = (inItem: any) => {
    const key = inItem.title.trim().toLowerCase();
    if (additions) {
      const newData = {
        ...additions,
        [key]: { ...additions[key], value: false },
      };
      props.setData((pre: any) => ({...pre , additions:newData}));
    }
  };

  return (
    <div className="WeTooTopicAddition">
      <div className="WeTooTopicAddition__header">
        <div className="WeTooTopicAddition__header__title">
          {lang["additions"]}
        </div>
        <SwitchButton
          checked={useAddition}
          onChange={(checked) => setUseAddition(checked)}
        />
      </div>
      {useAddition && (
        <div
          onClick={() => setShowAdditionModal(true)}
          className="WeTooTopicAddition__addBtn"
        >
          <div className="WeTooTopicAddition__addBtn__icon">+</div>
          Add
        </div>
      )}
      {additions &&
        useAddition &&
        Object.values(additions).map(
          (item, index) =>
            item.preview &&
            item.value && (
              <div className="WeTooTopicAddition__addBtn" key={index}>
                <img
                  src={item.icon}
                  className="WeTooTopicAddition__addBtn__previewIcon"
                />
                {item.title}
                <div className="WeTooTopicAddition__addBtn__preview">
                  {item.preview}

                  <div
                    onClick={() => removeAttachment(item)}
                    className="WeTooTopicAddition__addBtn__preview__cancel"
                  >
                    {" "}
                    &#215;
                  </div>
                </div>
              </div>
            )
        )}
    </div>
  );
};

export default TopicAddition;
