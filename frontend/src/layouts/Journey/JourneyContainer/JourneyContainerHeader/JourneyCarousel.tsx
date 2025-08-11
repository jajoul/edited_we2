import * as React from "react";
import chevron from "@/assets/images/chevron-right.svg";
import Countdown from "react-countdown";
import { Link } from "umi";
import "./JourneyContainerHeader.less";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import logo from '@/assets/images/logo.png'
export default function (props: { dataList: any[] }) {
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);

  const container = (
    room_id: string | undefined,
    children: any,
    index: number
  ) =>
    room_id ? (
      <a
        key={index}
        target="_blank"
        className="journeyCarouselContainer__item"
        href={`http://62-60-164-69.openvidu-local.dev:7443/openvidu-call/${room_id}`}
        style={{
          border:
            index === activeSlideIndex
              ? "5px solid transparent"
              : "30px solid transparent",
        }}
      >
        {children}
      </a>
    ) : (
      <div
        style={{
          border:
            index === activeSlideIndex
              ? "5px solid transparent"
              : "30px solid transparent",
        }}
        key={index}
        className="journeyCarouselContainer__item"
      >
        {children}
      </div>
    );

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a complete state
      return <div className="journeyTimeDownComplete">In Process...</div>;
    } else {
      // Render a countdown
      return (
        <span className="journeyTimeDown">
          <div className="journeyTimeDown__box">
            <span className="journeyTimeDown__box__time">{days}</span>
            <span className="journeyTimeDown__box__label">Days</span>
          </div>{" "}
          :
          <div className="journeyTimeDown__box">
            <span className="journeyTimeDown__box__time">{hours}</span>
            <span className="journeyTimeDown__box__label">hours</span>
          </div>{" "}
          :
          <div className="journeyTimeDown__box">
            <span className="journeyTimeDown__box__time">{minutes}</span>
            <span className="journeyTimeDown__box__label">Minutes</span>
          </div>
        </span>
      );
    }
  };

  return (
    <Carousel
      autoPlay
      onChange={(w) => setActiveSlideIndex(w)}
      showIndicators={false}
      className="journeyCarouselContainer"
      centerMode
      infiniteLoop
      showStatus={false}
      renderArrowPrev={(e) => {
        return (
          <span onClick={e} className="carouselBtn carouselBtn--forward">
            <img src={chevron} />
          </span>
        );
      }}
      renderArrowNext={(e) => (
        <span onClick={e} className="carouselBtn carouselBtn--backward">
          <img src={chevron} />
        </span>
      )}
    >
      {props.dataList.map((item, index) =>
        container(
          item.room_id,

          <>
            <img
              src={item.cover || logo}
              className="journeyCarouselContainer__item__image"
            />

            <div className="journeyCarouselContainer__item__content">
              <div className="journeyCarouselContainer__item__content__title">
                {item.title.slice(0, 10)} ...
              </div>
              <div className="">
                <Countdown
                  date={item.date ? new Date(item.date) : new Date()}
                  renderer={renderer}
                />
              </div>
            </div>
          </>,
          index
        )
      )}
    </Carousel>
  );
}
