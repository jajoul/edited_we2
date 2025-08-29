import arrowLeft from "@/assets/images/arrow-left.svg";
import Location from "@/assets/images/smallIcons/location.svg";
import Movie from "@/assets/images/smallIcons/movie.svg";
import pdf from "@/assets/images/smallIcons/pdf.svg";
import picture from "@/assets/images/smallIcons/picture.svg";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import Title, { size } from "@/components/Title/Title";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "./AdditionModal.less";

import mapPreviewImage from "@/assets/images/mapPreview.png";
import pdfPreview from "@/assets/images/pdfPreview.png";

import { getFilesBaseOnLanguages } from "../../language/language";

import { ChangeEvent, useState } from "react";

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

export interface AdditionDataType {
  [key: string]: {
    click?: () => void;
    accept?: string;
    value: any;
    title: string;
    icon: string;
    preview: JSX.Element;
  };
}

const AdditionModal = (props: {
  saveAndClose: (data: any) => void;
  initialData?: AdditionDataType;
}) => {
  const { saveAndClose, initialData } = props;
  const [locationPicker, setLocationPicker] = useState(false);

  const [marker, setMarker] = useState(DefaultLocation);
  const lang = getFilesBaseOnLanguages();

  const [additions, setAdditions] = useState<AdditionDataType>(
    initialData || {
      location: {
        title: lang["location"],
        icon: Location,
        preview: (<></>) as JSX.Element,
        click: () => setLocationPicker(true),
        value: null as any,
      },
      video: {
        title: lang["video"],
        icon: Movie,
        preview: (<></>) as JSX.Element,
        accept: "video/mp4,video/x-m4v,video/*",
        value: null as any,
      },
      picture: {
        title: lang["picture"],
        icon: picture,
        preview: (<></>) as JSX.Element,
        accept: "image/png, image/jpeg",
        value: null as any,
      },
      pdf: {
        title: lang["pdf"],
        icon: pdf,
        preview: (<></>) as JSX.Element,
        accept: "application/pdf",
        value: null as any,
      },
    }
  );

  const setLocationAndBack = () => {
    const mapPreview = <img src={mapPreviewImage} />;
    setAdditions((pre) => ({
      ...pre,
      location: { ...pre.location, value: marker, preview: mapPreview },
    }));
    setLocationPicker(false);
  };

  const getFile = (
    e: ChangeEvent<HTMLInputElement>,
    key: string // "pdf" | "picture" | "video" | "location"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          let preview = <></>;
          if (key === "video")
            preview = (
              <video src={reader.result} autoPlay={false} muted={true} />
            );
          else if (key === "picture") preview = <img src={reader.result} />;
          else if (key === "pdf") preview = <img src={pdfPreview} />;
          setAdditions((pre) => ({
            ...pre,
            [key]: { ...pre[key], preview, value: file },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (event: any) => {
    setMarker(event.detail.latLng);
  };

  return (
    <div
      className={`WeTooAdditionModal ${locationPicker && "WeTooAdditionModal--map"}`}>
      {locationPicker ? (
        <>
          <div
            onClick={() => setLocationAndBack()}
            className="WeTooAdditionModal__backBtn"
          >
            <img src={arrowLeft} />
          </div>
          <APIProvider apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8">
            <Map
              defaultCenter={DefaultLocation}
              defaultZoom={DefaultZoom}
              style={{ height: "700px" }}
              onClick={handleMapClick}
            >
              <Marker position={marker} />
            </Map>
          </APIProvider>
        </>
      ) : (
        <>
          <div className="WeTooAdditionModal__borderTop" />
          <Title
            title={lang["additions"]}
            size={size.small}
            className="WeTooAdditionModal__title"
          />
          <div className="WeTooAdditionModal__list">
            {Object.entries(additions).map(([key, item], index) => (
              <>
                <label
                  htmlFor={`WeTooAdditionModalInput--${index}`}
                  className="WeTooAdditionModal__list__item"
                  key={index}
                  onClick={() => item.click && item.click()}
                >
                  <img
                    src={item.icon}
                    className="WeTooAdditionModal__list__icon"
                  />
                  {item.title}
                  <div className="WeTooAdditionModal__list__preview">
                    {item.preview}
                  </div>
                </label>
                {item.accept && (
                  <input
                    id={`WeTooAdditionModalInput--${index}`}
                    type="file"
                    accept={item.accept}
                    onChange={(e) => getFile(e, key)}
                  />
                )}
              </>
            ))}
          </div>
          <Buttons
            label={lang["add"]}
            theme={buttonTheme.gradient}
            className="WeTooAdditionModal__btn"
            onClick={() => saveAndClose(additions)}
          />
        </>
      )}
    </div>
  );
};

export default AdditionModal;