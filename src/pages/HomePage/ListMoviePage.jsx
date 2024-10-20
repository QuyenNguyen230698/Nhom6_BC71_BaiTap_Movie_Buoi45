import React, { useEffect, useState } from "react";
import { movieService } from "../../services/movieService";
import { NavLink } from "react-router-dom";
import { Modal } from "antd";
import AOS from 'aos';
import {useTranslation} from 'react-i18next';
import 'aos/dist/aos.css';

export default function ListMoviePage() {
  const { t, i18n } = useTranslation();
  // Create state listMovie
  let [listMovie, setlistMovie] = useState();
  // show modal
  const [isModalVisible, setIsModalVisible] = useState(false);
   // Save URL video
  const [videoUrl, setVideoUrl] = useState("");

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

  //#region load API list movie
  useEffect(() => {
    movieService
      .getListMovie()
      .then((result) => {
        setlistMovie(result.data.content);
      })
      .catch((err) => {});
  }, []);
  //#endregion

  //#region renderListMovie
  let renderListMovie = () => {
    return listMovie?.slice(0, 12).map((movie, index) => {
      return (
        <div
          key={index}
          className="w-64 bg-white border border-gray-200 rounded-lg shadow relative group"
        >
          <img
            className="rounded-lg w-full h-80 "
            src={movie.hinhAnh}
            alt="true"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <button
            onClick={()=>{showModal(movie.trailer)}}
              type="button"
              className="absolute w-full h-80 justify-center items-center flex z-20"
            >
              <svg
                className="h-20 w-20 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <circle cx={12} cy={12} r={10} />{" "}
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </button>
            <h5 className="text-center uppercase font-bold pb-2 text-white z-10">
              {movie.tenPhim}
            </h5>
            <div className="text-nowrap z-20">
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                <NavLink to={`/detail/${movie.maPhim}`}>{t("Buy ticket")}</NavLink>
              </button>
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                <NavLink to={`/detail/${movie.maPhim}`}>{t("Detail")}</NavLink>
              </button>
            </div>
          </div>
        </div>
      );
    });
  };
  //#endregion

  //#region showModalTrailer
  const showModal = (url) => {
    const embedUrl = url.replace("watch?v=", "embed/") + "?autoplay=1";
    setVideoUrl(embedUrl);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setVideoUrl("");
    window.location.href = "/";
  };
  //#endregion
  return (
    <div data-aos="fade-up" data-aos-delay="800" className="container-listMovie grid grid-cols-4 gap-6 pt-4">
      {renderListMovie()}
      {/* Modal show trailer */}
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
            title="Trailer"
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
