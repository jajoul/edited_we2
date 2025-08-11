import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Inputs, { inputType } from "@/components/Inputs/Inputs";
import Modal from "@/components/Modal/Modal";
import { useContext, useEffect, useState } from "react";
import InsightWebTags from "../InsightWeb/InsightExplore/InsightWebTags/InsightWebTags";
import PageTemplate from "../NewChanel/PageTemplate/PageTemplate";
import TopicList from "../NewChanel/TopicList/TopicList";
import AdditionModal, { AdditionDataType } from "./AdditionModal/AdditionModal";
import picture from "@/assets/images/smallIcons/picture.svg";
import Movie from "@/assets/images/smallIcons/movie.svg";
import pdf from "@/assets/images/smallIcons/pdf.svg";
import "./NewTopicContainer.less";
import TopicAddition from "./TopicAddition/TopicAddition";
import { history, useParams } from "umi";
import {
  createEditTopic,
  deleteImage,
  deletePDF,
  deleteVideo,
  getTags,
  getTopicById,
} from "@/assets/Api";
import { Context } from "@/assets/Provider/Provider";
import { SET_TAGS, newChannelData } from "@/assets/Provider/types";
import { toast } from "react-toastify";
import { getFilesBaseOnLanguages } from "../language/language";
import Spinner from "@/components/Spinner/Spinner";

export interface data {
  tag: (number | string)[];
  name: string;
  description: string;
  additions?: AdditionDataType;
}

const NewTopicContainer = () => {
  const { state, dispatch } = useContext(Context);
  const [showAdditionModal, setShowAdditionModal] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState<data>({
    tag: [],
    name: "",
    description: "",
  });
  const { id } = useParams();
  const lang = getFilesBaseOnLanguages();

  const getTopicData = () => {
    setDataLoading(true);
    getTopicById(id || "").then((res) => {
      setDataLoading(false);
      if (res.data) {
        setData({
          tag: res.data.tags.map((item: { id: string }) => item.id),
          name: res.data?.name,
          description: res.data?.description,
          additions: {
            picture: {
              preview: <img src={res.data?.picture} />,
              title: lang["picture"],
              icon: picture,
              value: res.data?.picture,
              accept: "image/png, image/jpeg",
            },
            video: {
              title: lang["video"],
              icon: Movie,
              preview: (
                <video src={res.data?.video} autoPlay={false} muted={true} />
              ),
              accept: "video/mp4,video/x-m4v,video/*",
              value: res.data?.video,
            },
            pdf: {
              title: lang["pdf"],
              icon: pdf,
              preview: res.data?.pdf && <img src={pdf} />,
              accept: "application/pdf",
              value: res.data?.pdf,
            },
          },
        }); //pdf,picture,video
      }
    });
  };

  useEffect(() => {
    if (!state.tags) {
      getTags().then((res) => {
        if (res.data) {
          dispatch({ type: SET_TAGS, data: { tags: res.data } });
        }
      });
    }
    if (history.location.pathname.includes("edit") && id) {
      getTopicData();
    }
  }, []);

  const updateData = (value: string, key: string) => {
    setData((pre) => ({ ...pre, [key]: value }));
  };

  const saveAndClose = (data: any) => {
    setData((pre) => ({ ...pre, additions: data }));
    setShowAdditionModal(false);
  };

  const publishAndForward = () => {
    const notError =
      data.name.trim().length > 2 &&
      data.description.trim().length > 2 &&
      data.tag.length > 0;
    if (!notError) {
      setError(!notError);
    } else if (!loading) {
      setLoading(true);
      const pdf = data.additions?.pdf?.value;
      const picture = data.additions?.picture?.value;
      const video = data.additions?.video?.value;

      const publicData: newChannelData = {
        description: data.description,
        name: data.name,
        tags: data.tag,
        location: data.additions?.location?.value,
        pdf: typeof pdf !== "string" && pdf,
        picture: typeof picture !== "string" && picture,
        video: typeof video !== "string" && video,
        which_type: state.userInfo?.user?.which_type || 0,
      };
      if (!history.location.pathname.includes("edit"))
        publicData.channel = id || "";

      if (typeof pdf === "boolean" && !pdf && id) deletePDF(id);
      if (typeof picture === "boolean" && !picture && id) deleteImage(id);
      if (typeof video === "boolean" && !video && id) deleteVideo(id);

      createEditTopic(
        publicData,
        history.location.pathname.includes("edit"),
        history.location.pathname.includes("edit") ? id : ""
      ).then((res) => {
        setLoading(false);
        if (res.status === 201 || res.status === 200) {
          if (history.location.pathname.includes("edit"))
            history.push(`/topic/${id}`);
          else history.push(`/channel/${id}`);
        } else {
          toast(lang["new_channel_and_topic_error_toast_msg"], {
            type: "error",
          });
        }
      });
    }
  };

  const toggleTag = (id: string | number) => {
    if (data.tag.includes(id)) {
      const newTags = data.tag.filter((item) => item !== id);
      setData((pre) => ({ ...pre, tag: newTags }));
    } else {
      setData((pre) => ({ ...pre, tag: [...pre.tag, id] }));
    }
  };

  return (
    <>
      <div className="WeTooNewTopicContainer">
        {dataLoading ? (
          <div className="WeTooNewTopicContainer__loading">
            <Spinner purple={true} width="80px" />
          </div>
        ) : (
          <PageTemplate
            children={
              <>
                <h4 className="WeTooNewTopicContainer__title">
                  {lang["tag"]}
                  {error && data.tag.length === 0 && (
                    <small className="WeTooNewTopicContainer__title__error">
                      {lang["select_tag"]}
                    </small>
                  )}
                </h4>
                <InsightWebTags
                  tags={state.tags || []}
                  onClick={(v) => toggleTag(v)}
                  activeId={data.tag}
                />
                <div className="WeTooNewTopicContainer__container">
                  <Inputs
                    onChange={(value) => updateData(value, "name")}
                    type={inputType.text}
                    value={data.name}
                    label={lang["topic_name"]}
                    placeholder={lang["add_topic_placeholder"]}
                    className="WeTooNewTopicContainer__input"
                    errorText={
                      error && data.name.trim().length < 3
                        ? lang["name_error"]
                        : undefined
                    }
                  />
                  <Inputs
                    isTextArea
                    onChange={(value) => updateData(value, "description")}
                    type={inputType.text}
                    value={data.description}
                    label={lang["description"]}
                    placeholder={lang["description_placeholder"]}
                    className="WeTooNewTopicContainer__input"
                    errorText={
                      error && data.description.trim().length < 3
                        ? lang["name_error"]
                        : undefined
                    }
                  />
                  <TopicAddition
                    additions={data.additions}
                    setShowAdditionModal={setShowAdditionModal}
                    setData={setData}
                  />
                  <Buttons
                    className="WeTooNewTopicContainer__btn"
                    label={
                      history.location.pathname.includes("edit")
                        ? lang["edit"]
                        : lang["publish"]
                    }
                    theme={buttonTheme.gradient}
                    onClick={publishAndForward}
                    loading={loading}
                  />
                </div>
              </>
            }
            pageTitle={lang["add_topic"]}
            className="WeTooNewTopicContainerBody"
          />
        )}
        <TopicList />
      </div>
      <Modal
        Close={() => setShowAdditionModal(false)}
        content={
          <AdditionModal
            saveAndClose={saveAndClose}
            initialData={data.additions}
          />
        }
        show={showAdditionModal}
      />
    </>
  );
};

export default NewTopicContainer;
