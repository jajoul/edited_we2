import { useEffect, useState } from "react";
import "./InsightSubject.less";
import { trendTags } from "@/assets/Api";
import Title, { size } from "@/components/Title/Title";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";
import { Link } from "umi";

const InsightSubject = () => {
  // const [loading, setLoading] = useState(true);
  const [Tag, setTags] = useState<{ id: number; name: string }[]>([]);

  const gradients = [
    "107.19deg, #4B0070 0%, #7E00BC 100%",
    "107.19deg, #254699 0%, #3C9AB8 100%",
    "107.19deg, #008C41 0%, #019672 100%",
    "107.19deg, #A6B500 0%, #DCAC00 100%",
    "107.19deg, #8A008C 0%, #960149 100%",
  ];

  useEffect(() => {
    trendTags().then((res) => {
      // setLoading(false);
      if (res.data) setTags(res.data);
    });
  }, []);

  const lang = getFilesBaseOnLanguages();

  return (
    <>
      <Title size={size.small} title={lang["trending_tags"]} />
      <div className="WeTooInsightSubject">
        {Tag.map((item, index) => (
          <Link
            to={`/topics/tag=${item.id}`}
            key={index}
            className="WeTooInsightSubject__item"
            style={{ background: `linear-gradient(${gradients[index]})` }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default InsightSubject;
