import "./InsightWebTags.less";
import { Link } from "umi";

const InsightWebTags = (props: {
  className?: string;
  onClick?: (tag: string | number) => void;
  activeId?: (string | number)[];
  tags: { name: string; id: string | number; link?: string }[];
}) => {
  const { className, onClick, tags, activeId } = props;

  return (
    <div className={`WeTooInsightWebTags ${className}`}>
      {tags?.map((item, index) => {
        const generalClass = `WeTooInsightWebTags__item ${
          activeId?.includes(item.id) && "WeTooInsightWebTags__item--active"
        }`;
        return item.link ? (
          <Link key={index} className={generalClass} to={item.link}>
            {item.name}
          </Link>
        ) : (
          <div
            onClick={() => onClick && onClick(item.id)}
            className={generalClass}
            key={index}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default InsightWebTags;
