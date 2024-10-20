import React, { useEffect, useState } from "react";
import { movieService } from "../../services/movieService";
import { NavLink } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function SearchPage() {
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
      duration: 1000,
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
        className="bg-gray-400 w-60 text-white px-4 py-2 rounded-lg cursor-not-allowed"
        disabled
      >
        Buy Ticket Now
      </button>
    );
  }
  return (
    <NavLink to={`/booking/${selectedScheduleId}`}>
      <button className="bg-red-600 w-60 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
        Buy Ticket Now
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
      return <option>No schedule available</option>;
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
      return <option>No time available</option>;
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
    <div data-aos="fade-up" data-aos-delay="500" id="listMovie" className="mx-96 pt-10">
      <div className="grid grid-cols-4 gap-4 pt-4">
        {/* Select Movie */}
        <form className="w-64 mx-auto">
          <select
            onChange={handleMovieChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
          >
            <option selected>Choose a movie</option>
            {renderSearchMovie()}
          </select>
        </form>

        {/* Select show schedule */}
        <form className="w-64 mx-auto">
          <select
            id="schedule"
            onChange={handleScheduleChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
          >
            <option selected>Choose a schedule</option>
            {renderSearchSchedule()}
          </select>
        </form>

        {/* Select date */}
        <form className="w-64 mx-auto">
          <select
            id="movie-day"
            onChange={handleMovieDayChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
          >
            <option selected>Movie day</option>
            {renderMovieDay()}
          </select>
        </form>

        {/* Buy ticket button */}
        {bookingTicket()}
      </div>
    </div>
  );
}
