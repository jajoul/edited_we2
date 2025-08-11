import React, { useContext, useState } from "react";
import "./InitialDataGetter.less";
import camera from "@/assets/images/smallIcons/camera.svg";
import Inputs from "@/components/Inputs/Inputs";
import { inputType } from "@/components/Inputs/Inputs";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import PageTemplate from "../PageTemplate/PageTemplate";
import { createChannel, updateChannel } from "@/assets/Api";
import { useParams } from "umi";
import { toast } from "react-toastify";
import { getFilesBaseOnLanguages } from "../../language/language";
import { getSearchParam } from "@/components/MenuBar/MenuBar";

export type dataType = {
  title: string;
  about: string;
  image: { base64: string; file: any } | null | string;
  id?: string;
};

const InitialDataGetter = (props: {
  data: dataType;
  setData: (data: dataType) => void;
  setSummery: (show: boolean) => void;
}) => {
  const { data, setData, setSummery } = props;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const lang = getFilesBaseOnLanguages();

  const changeField = (value: string, key: string) => {
    const newState = { ...data, [key]: value };
    setData(newState);
  };

  const checkFieldsAndCreate = () => {
    if (
      data.title?.trim().length < 2 ||
      data.about?.trim().length < 2 ||
      !data.image
    )
      setError(true);
    else if (!loading) {
      const requestData = {
        title: data.title,
        about: data.about,
        image: typeof data.image === "string" ? undefined : data.image?.file,
        which_type: getSearchParam("type") ? 0 : 1,
      };
      setLoading(true);
      if (!id && data.image !== "string") {
        createChannel(requestData)
          .then((res) => {
            setLoading(false);
            if (res.status === 201) {
              setData(res.data);
              setSummery(true);
            } else {
              toast(`${lang["new_channel_and_topic_error_toast_msg"]}`, {
                type: "error",
              });
            }
          })
          .catch(() => {
            setLoading(false);
          });
      } else if (id) {
        setLoading(true);
        updateChannel(requestData, id).then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setData(res.data);
            setSummery(true);
          }
        });
      }
    }
  };

  const setChannelImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        if (typeof reader.result === "string") {
          const newState = { ...data, image: { base64: reader.result, file } };
          setData(newState);
        }
      };
    }
  };

  const imageSrc =
    typeof data.image === "string" ? data.image : data.image?.base64;

  return (
    <PageTemplate
      pageTitle={lang["create_new_channel"]}
      className="WeTooInitialDataGetter"
      children={
        <>
          <div className="WeTooInitialDataGetter__title">
            Channel picture
            {error && !imageSrc && (
              <small className="WeTooInitialDataGetter__title__error">
                Please select an image
              </small>
            )}
          </div>
          <label
            className={`WeTooInitialDataGetter__label 
            ${imageSrc && "WeTooInitialDataGetter__label--fullImage"}`}
            htmlFor="WeTooInitialDataGetter__input"
          >
            <img src={imageSrc || camera} />
          </label>
          <input
            className="WeTooInitialDataGetter__input"
            id="WeTooInitialDataGetter__input"
            accept="image/png, image/jpeg"
            type="file"
            onChange={setChannelImage}
          />

          <Inputs
            onChange={(v) => changeField(v, "title")}
            type={inputType.text}
            value={data.title}
            label={lang["channel_name"]}
            placeholder="Add topic name"
            className="WeTooInitialDataGetter__textInput"
            errorText={
              error && data.title?.trim().length < 2
                ? lang["name_error"]
                : undefined
            }
          />
          <Inputs
            isTextArea={true}
            onChange={(v) => changeField(v, "about")}
            type={inputType.text}
            value={data.about}
            label={lang["about_channel"]}
            placeholder="Add your description"
            className="WeTooInitialDataGetter__textInput"
            errorText={
              error && data.about?.trim().length < 2
                ? lang["channel_about_error_msg"]
                : undefined
            }
          />
          <Buttons
            label={id ? lang["update"] : lang["create"]}
            theme={buttonTheme.gradient}
            className="WeTooInitialDataGetter__btn"
            onClick={checkFieldsAndCreate}
            loading={loading}
          />
        </>
      }
    />
  );
};

export default InitialDataGetter;
