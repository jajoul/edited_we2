import React, { useEffect, useState } from "react";
import "./NewChanelContainer.less";
import InitialDataGetter, {
  dataType,
} from "./InitialDataGetter/InitialDataGetter";
import TopicList from "./TopicList/TopicList";
import NewChanelSummery from "./NewChanelSummery/NewChanelSummery";
import { useParams } from "umi";
import { getChannel } from "@/assets/Api";
import Spinner from "@/components/Spinner/Spinner";

const NewChanelContainer = () => {
  const [data, setData] = useState<dataType>({
    title: "",
    about: "",
    image: null,
  });
  const [showSummery, setSummery] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getChannel(id).then((res) => {
        setLoading(false);
        if (res.data) setData(res.data);
      });
    }
  }, []);

  return (
    <div className="WeTooNewChanelContainer">
      {loading ? (
        <div className="WeTooNewChanelContainer__loading">
          <Spinner purple width="80px" />
        </div>
      ) : showSummery ? (
        <NewChanelSummery data={data} setSummery={setSummery} />
      ) : (
        <InitialDataGetter
          setSummery={setSummery}
          data={data}
          setData={setData}
        />
      )}
      <TopicList />
    </div>
  );
};

export default NewChanelContainer;
