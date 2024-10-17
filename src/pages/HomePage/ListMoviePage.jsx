import React, { useEffect, useState } from "react";
import { http } from "../../services/config";
import { useNavigate } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { NavLink } from "react-router-dom";
import { Modal } from "antd";

export default function ListMoviePage() {
  let [listMovie, setlistMovie] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""); // Lưu trữ URL video hiện tại
  let navigate = useNavigate();
  let handleBooking = () => {
    navigate("/booking");
  };
  useEffect(() => {
    movieService
      .getListMovie()
      .then((result) => {
        setlistMovie(result.data.content);
      })
      .catch((err) => {});
  }, []);
  //#region renderListMovie
  let renderListMovie = () => {
    console.log('listMovie :',listMovie);
    return listMovie?.slice(0, 12).map((movie, index) => {
      return (
        <div
          key={index}
          className="max-w-sm bg-white border border-gray-200 rounded-lg shadow relative group"
        >
          <img
            className="rounded-lg w-64 h-80 "
            src={movie.hinhAnh}
            alt="true"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
            onClick={()=>{showModal(movie.trailer)}}
              type="button"
              className="absolute w-64 h-80 justify-center items-center flex z-20"
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
                <NavLink to={`/detail/${movie.maPhim}`}>Buy ticket</NavLink>
              </button>
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                <NavLink to={`/detail/${movie.maPhim}`}>Detail</NavLink>
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
    setVideoUrl(""); // Xóa URL để dừng video
    window.location.href = "/";
  };
  //#endregion
  return (
    <div className="mx-60 grid grid-cols-4 gap-4 pt-4">
      {renderListMovie()}
      <Modal
        title="Trailer Video"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Không có nút footer
        width="80%" // Chiều rộng 80%
        bodyStyle={{ height: "500px" }} // Chiều cao 500px
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
