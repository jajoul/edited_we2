import TopicList from "@/layouts/NewChanel/TopicList/TopicList";
import "./JourneyContainer.less";
import JourneyContainerHeader from "./JourneyContainerHeader/JourneyContainerHeader";

import { Link } from "umi";
import { useContext, useEffect, useState } from "react";
import { uploadedList } from "@/assets/Api";
import logo from "@/assets/images/logo.png";
import { Context } from "@/assets/Provider/Provider";

const JourneyContainer = (props: { searchValue?: string }) => {
  const { state } = useContext(Context);

  const { searchValue } = props;
  const [uploadListLoading, setUploadListLoading] = useState(true);

  const [uploadedData, setUploadedData] = useState<
    {
      cover: string;
      video: string;
      description: string;
      title: string;
      url?: string;
    }[]
  >([]);


  useEffect(() => {
    uploadedList()
      .then((res: any) => {
        setUploadListLoading(false);
        if (res?.data) setUploadedData(res.data);
      })
      .catch(() => {
        setUploadListLoading(false);
      });
  }, []);

  return (
    <div className="JourneyContainer">
      <div className="JourneyContainer__body">
        <JourneyContainerHeader />

        <div className="JourneyContainer__list">
          {uploadListLoading ? (
            Array.from({ length: 2 }).map((item: any) => (
              <div
                key={item}
                className="skeleton-box JourneyContainer__list__cart"
              ></div>
            ))
          ) : uploadedData?.length > 0 ? (
            uploadedData.map((item, index) =>
              !searchValue ||
              item.title?.toLowerCase().includes(searchValue?.toLowerCase()) ? (
                <a
                  download
                  href={item.url || item.video + "?embedded=true"}
                  target="_blank"
                  className="JourneyContainer__list__cart"
                  key={index}
                >
                  <img
                    className="JourneyContainer__list__cart__img"
                    src={item.cover || logo}
                  />
                  <div className="JourneyContainer__list__cart__content">
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </a>
              ) : (
                <></>
              )
            )
          ) : (
            <div className="JourneyContainer__list__danger">
              There is not any Uploaded Video
            </div>
          )}
        </div>
      </div>

      <TopicList />

      {state.userInfo?.user?.which_type === 0 && (
        <Link to="/journey/live" className="JourneyContainer__livBtn">
          +
        </Link>
      )}
    </div>
  );
};

export default JourneyContainer;
