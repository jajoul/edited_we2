import Inputs, { inputType } from "@/components/Inputs/Inputs";
import "./UploadTab.less";
import { toast } from "react-toastify";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import cameraIcon from "@/assets/images/smallIcons/camera.svg";
import { useState } from "react";
import imageLogo from "@/assets/images/smallIcons/picture.svg";
import { uploadVideoRequest } from "@/assets/Api";

const UploadTab = () => {
  const [data, setData] = useState<{
    cover: { file: any; base64: any };
    name: string;
    description: string;
    video: any;
  }>({
    name: "",
    description: "",
    cover: { file: "", base64: "" },
    video: { file: null, preview: "" },
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadCover = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        if (typeof reader.result === "string")
          setData((pre) => ({
            ...pre,
            cover: { base64: reader.result, file },
          }));
      };
    }
  };

  const uploadVideo = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setData((pre) => ({
            ...pre,
            video: { file: file, preview: reader.result },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const upload = () => {
    //upload video
    const newError =
      !data.cover.base64 || !data.description || !data.name || !data.video;
    if (!newError) {
      setError(false);
      setLoading(true);
      if (!loading)
        uploadVideoRequest(
          data.name,
          data.description,
          data.video?.file,
          data.cover.file
        )
          .then((res) => {
            setLoading(false);
            if (res.response?.status === 403)
              toast(res.response?.data?.detail, {
                type: "error",
              });
            else
              toast(`uploaded successfully`, {
                type: "success",
              });
          })
          .catch(() => {
            toast(`There is an error`, {
              type: "error",
            });
          });
    } else {
      setError(true);
    }
  };

  return (
    <div className="weTooUploadTab">
      <div className="weTooUploadTab__body">
        <Inputs
          onChange={(v) => setData((pre) => ({ ...pre, name: v }))}
          type={inputType.text}
          value={data.name}
          label="Live name"
          placeholder="Add live name"
          className="weTooUploadTab__body__input"
          errorText={error && !data.name ? "Enter the name" : undefined}
        />

        <Inputs
          onChange={(v) => setData((pre) => ({ ...pre, description: v }))}
          type={inputType.text}
          value={data.description}
          label="Description"
          placeholder="Add your description"
          isTextArea
          className="weTooUploadTab__body__textArea"
          errorText={
            error && !data.description ? "Enter the description" : undefined
          }
        />

        <label className="weTooUploadTab__coverGetter">
          <img src={imageLogo} />
          {data.cover?.file ? data.cover.file?.name : "Upload Cover"}
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={uploadCover}
          />
        </label>
        {error && !data.cover.base64 && (
          <small style={{ color: "#d02027", marginRight: "auto" }}>
            Select a cover
          </small>
        )}

        <label className="weTooUploadTab__body__videoGetter">
          {data.video?.preview ? (
            <video src={data.video?.preview} autoPlay={false} muted={true} />
          ) : (
            <img src={cameraIcon} />
          )}
          <input
            type="file"
            accept="video/mp4,video/x-m4v,video/mkv,video/*"
            onChange={uploadVideo}
          />
        </label>
        {error && !data.video && (
          <small style={{ color: "#d02027", marginRight: "auto" }}>
            upload the video
          </small>
        )}

        <Buttons
          label={"Upload video"}
          theme={buttonTheme.gradient}
          className="weTooUploadTab__body__btn"
          onClick={upload}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UploadTab;
