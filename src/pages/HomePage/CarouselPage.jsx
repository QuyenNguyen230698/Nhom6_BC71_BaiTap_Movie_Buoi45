import React, { useState,useEffect } from "react";
import { Carousel, Modal } from "antd";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function CarouselPage() {
  // AOS animation
  useEffect(() => {
    AOS.init({
      offset: 400,
      delay: 0,
      duration: 1000,
      easing: 'ease',
      once: true,
    });
    AOS.refresh();
  }, []);
  const contentStyle = {
    margin: 0,
    height: "620px",
    color: "black",
    lineHeight: "620px",
    textAlign: "center",
    background: "gray",
  };
  //#region buttonplay Show modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""); 
 
  const showModal = (url) => {
    setVideoUrl(url); 
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setVideoUrl(""); 
    window.location.href = "/";
  };
  //#endregion

  return (
    <div id="carousel" data-aos="fade-up" data-aos-delay="200" className="pt-20">
      <Carousel autoplay arrows dotPosition="bottom">
        {/* Slide 1 */}
        <div className="pos" style={contentStyle}>
          <img
            style={{ width: "100%", height: 620 }}
            src="https://dafunda.com/wp-content/uploads/2024/09/Trailer-Red-One.jpg"
            alt=""
          />
          <button
            type="button"
            className="absolute flex justify-center items-center inset-0 opacity-0 hover:opacity-100"
            onClick={() =>
              showModal(
                "https://www.youtube.com/embed/HHSiOptJE8Y?si=52lHPtBUaZ8AYXJs"
              )
            }
          >
            <svg
              className="h-20 w-20 text-red-600 hover:text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={10} />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </button>
        </div>

        {/* Slide 2 */}
        <div className="pos" style={contentStyle}>
          <img
            style={{ width: "100%", height: 620 }}
            src="https://tongal.s3.amazonaws.com/custom-files/2024/08/14/VenomTheLastDanceInTheatersOctoberBanner_1.png"
            alt=""
          />
          <button
            type="button"
            className="absolute flex justify-center items-center inset-0 opacity-0 hover:opacity-100"
            onClick={() =>
              showModal(
                "https://www.youtube.com/embed/I1q-jmvPNn0?si=4JbG8iAdsRtJqDxE"
              )
            }
          >
            <svg
              className="h-20 w-20 text-red-600 hover:text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={10} />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </button>
        </div>

        {/* Slide 3 */}
        <div className="pos" style={contentStyle}>
          <img
            style={{ width: "100%", height: 620 }}
            src="https://i.ytimg.com/vi/ZIz8QQBYcx0/maxresdefault.jpg"
            alt=""
          />
          <button
            type="button"
            className="absolute flex justify-center items-center inset-0 opacity-0 hover:opacity-100"
            onClick={() =>
              showModal(
                "https://www.youtube.com/embed/nAktjgRzk5g?si=ylxtDmaPeXDDNHtn"
              )
            }
          >
            <svg
              className="h-20 w-20 text-red-600 hover:text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={10} />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </button>
        </div>
      </Carousel>

      {/* Modal all slides */}
      <Modal
        title="Trailer Video"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="80%"
        bodyStyle={{ height: "500px" }}
      >
        {videoUrl && (
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </Modal>
    </div>
  );
}
