import Inputs, { inputType } from "@/components/Inputs/Inputs";
import "./ScheduledTab.less";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import imageLogo from "@/assets/images/smallIcons/picture.svg";
import { useState } from "react";
import { scheduleMeet } from "@/assets/Api";
import { toast } from "react-toastify";

const ScheduledTab = () => {
  const [data, setData] = useState<{
    cover: { file: any; base64: any };
    name: string;
    description: string;
    date: any;
  }>({
    name: "",
    date: "",
    description: "",
    cover: { file: "", base64: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const uploadCover = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
          toast("File size exceeds 2 MB. Please select a smaller file.", {
            type: "error",
          });
          e.target.value = ""; // Clear the input value
        } else if (typeof reader.result === "string")
          setData((pre) => ({
            ...pre,
            cover: { base64: reader.result, file: file },
          }));
      };
    }
  };

  const schedule = () => {
    const newError =
      !data.cover.base64 || !data.date || !data.description || !data.name;
    if (!newError) {
      setError(false);
      setLoading(true);
      if (!loading)
        scheduleMeet(data.name, data.description, data.date, data.cover.file)
          .then((res) => {
            setLoading(false);
            if (res.response?.status === 403)
              toast(res.response?.data?.detail, {
                type: "error",
              });
            else
              toast(`Scheduled successfully`, {
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
    <div className="weTooScheduledTab">
      <div className="weTooScheduledTab__body">
        <Inputs
          onChange={(v) => setData((pre) => ({ ...pre, name: v }))}
          type={inputType.text}
          value={data.name}
          label="Live name"
          placeholder="Add live name"
          className="weTooScheduledTab__body__input"
          errorText={error && !data.name ? "Enter the name" : undefined}
        />

        <div className="weTooScheduledTab__date">
          <div className="weTooScheduledTab__date__label">Time</div>

          <input
            name="weTooScheduledTab__timeGetter"
            id="weTooScheduledTab__timeGetter"
            type="date"
            placeholder="Select Time"
            onChange={(e) =>
              setData((pre) => ({ ...pre, date: e.target.value }))
            }
          />
          {error && !data.date && (
            <small style={{ color: "#d02027" }}>Enter the date</small>
          )}
        </div>

        <Inputs
          onChange={(v) => setData((pre) => ({ ...pre, description: v }))}
          type={inputType.text}
          value={data.description}
          label="Description"
          placeholder="Add your description"
          isTextArea
          className="weTooScheduledTab__body__textArea"
          errorText={
            error && !data.description ? "Enter the description" : undefined
          }
        />

        <label className="weTooScheduledTab__coverGetter">
          <img src={imageLogo} />
          {data.cover?.file ? data.cover.file?.name : "Upload Cover"}
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => uploadCover(e)}
          />
        </label>
        {error && !data.cover.base64 && (
          <small style={{ color: "#d02027", marginRight: "auto" }}>
            Select a cover
          </small>
        )}

        <Buttons
          className="weTooScheduledTab__btn"
          label={"Add Announcement"}
          theme={buttonTheme.gradient}
          onClick={schedule}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ScheduledTab;
