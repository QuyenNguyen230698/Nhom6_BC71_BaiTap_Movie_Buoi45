import React, { useEffect, useState } from "react";
import { movieService } from "../../services/movieService";
import { NavLink } from "react-router-dom";
import AOS from 'aos';
import {useTranslation} from 'react-i18next';
import 'aos/dist/aos.css';

export default function SearchPage() {
  const { t, i18n } = useTranslation();
  // Create state save listMovie
  let [searchMovie, setSearchMovie] = useState([]);
  let [selectedMovieId, setSelectedMovieId] = useState(null); 
  // Save ID movie
  let [searchSchedule, setSearchSchedule] = useState([]);
  // Save ID calendar
  let [selectedScheduleId, setSelectedScheduleId] = useState(null); 
  // Save day 
  let [selectedMovieDay, setSelectedMovieDay] = useState(null); 

  // AOS animation
  useEffect(() => {
    AOS.init({
      offset: 400,
      delay: 0,
      duration: 500,
      easing: 'ease',
      once: true,
    });
    AOS.refresh();
  }, []);

//#region Call API
  // Get list movie
  useEffect(() => {
    movieService
      .getListMovie()
      .then((result) => {
        setSearchMovie(result.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Get Info ID when user select movie
  useEffect(() => {
    if (selectedMovieId) {
      movieService
        .getDetailSchedule(selectedMovieId)
        .then((result) => {
          setSearchSchedule(result.data.content); // Cập nhật lịch chiếu vào state
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedMovieId]);
//#endregion

//#region render buy ticket button
let bookingTicket = () => {
  if (!selectedMovieId || !selectedScheduleId || !selectedMovieDay) {
    return (
      <button
        className="bg-gray-400 w-60 text-white px-8 py-3 rounded-lg cursor-not-allowed"
        disabled
      >
        {t("Buy Ticket Now")}
      </button>
    );
  }
  return (
    <NavLink to={`/booking/${selectedScheduleId}`}>
      <button className="bg-red-600 w-60 hover:bg-red-700 text-white px-8
       py-3 rounded-lg">
        {t("Buy Ticket Now")}
      </button>
    </NavLink>
  );
};
//#endregion


// Render list movie
  let renderSearchMovie = () => {
    return searchMovie?.map((movie, index) => {
      return (
        <option key={index} value={movie.maPhim}>
          {movie.tenPhim}
        </option>
      );
    });
  };

// Render movie schedule
  let renderSearchSchedule = () => {
    if (!searchSchedule?.heThongRapChieu?.length) {
      return <option>{t("No schedule available")}</option>;
    }

    // Render lịch chiếu từ API
    return searchSchedule.heThongRapChieu.map((heThongRap, index) => {
      return heThongRap.cumRapChieu.map((cumRap, index) => {
        return cumRap.lichChieuPhim.map((lichChieu, index) => (
          <option key={index} value={lichChieu.maLichChieu}>
            {cumRap.tenCumRap}
          </option>
        ));
      });
    });
  };
// Render movie date
  let renderMovieDay = () => {
    if (!searchSchedule?.heThongRapChieu?.length) {
      return <option>{t("No time available")}</option>;
    }
    return searchSchedule.heThongRapChieu.map((heThongRap, index) => {
      return heThongRap.cumRapChieu.map((cumRap) => {
        return cumRap.lichChieuPhim.map((lichChieu, index) => (
          <option key={index} value={lichChieu.maLichChieu}>
            {lichChieu.ngayChieuGioChieu}
          </option>
        ));
      });
    });
  };

  // selectedMovieId
  const handleMovieChange = (e) => {
    const movieId = e.target.value;
    // Save ID to call API 
    setSelectedMovieId(movieId); 
  };
  // Function Choose a movie showtime
  const handleScheduleChange = (e) => {
    const scheduleId = e.target.value;
    setSelectedScheduleId(scheduleId); // Lưu ID lịch chiếu
  };

  // Function choose a movie date
  const handleMovieDayChange = (e) => {
    const movieDay = e.target.value;
    setSelectedMovieDay(movieDay); // Lưu ngày chiếu
  };

  return (
    <div data-aos="fade-up" data-aos-delay="500" id="listMovie" className="container-listMovie pt-5">
      <div className="grid grid-cols-4 gap-4 pt-4">
        {/* Select Movie */}
        <form className="w-full">
          <select
            onChange={handleMovieChange}
            className="bg-button text-center text-white border border-gray-300 text-base rounded-lg focus:ring-gray-700 focus:border-gray-700 hover:bg-gray-700 block w-full p-2.5"
          >
            <option selected>{t("Choose a movie")}</option>
            {renderSearchMovie()}
          </select>
        </form>

        {/* Select show schedule */}
        <form className="w-full">
          <select
            id="schedule"
            onChange={handleScheduleChange}
            className="bg-button text-center text-white border border-gray-300 text-base rounded-lg focus:ring-gray-700 focus:border-gray-700 hover:bg-gray-700 block w-full p-2.5"
          >
            <option selected>{t("Choose a schedule")}</option>
            {renderSearchSchedule()}
          </select>
        </form>

        {/* Select date */}
        <form className="w-full">
          <select
            id="movie-day"
            onChange={handleMovieDayChange}
            className="bg-button text-center text-white border border-gray-300 text-base rounded-lg focus:ring-gray-700 focus:border-gray-700 hover:bg-gray-700 block w-full p-2.5"
          >
            <option selected>{t("Choose day")}</option>
            {renderMovieDay()}
          </select>
        </form>

        {/* Buy ticket button */}
        <div className="w-full">
          {bookingTicket()}
        </div>
      </div>
    </div>
  );
}
