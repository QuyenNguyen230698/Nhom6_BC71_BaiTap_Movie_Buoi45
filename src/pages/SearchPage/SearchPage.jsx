import React, { useEffect, useState } from "react";
import { movieService } from "../../services/movieService";
import { NavLink } from "react-router-dom";

export default function SearchPage() {
  let [searchMovie, setSearchMovie] = useState([]);
  let [selectedMovieId, setSelectedMovieId] = useState(null); // Lưu ID của phim đã chọn
  let [searchSchedule, setSearchSchedule] = useState([]);
  let [selectedScheduleId, setSelectedScheduleId] = useState(null); // Lưu ID của lịch chiếu đã chọn
  let [selectedMovieDay, setSelectedMovieDay] = useState(null); // Lưu ngày chiếu đã chọn

  // Lấy danh sách phim khi component được mount
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

  // Gọi API lấy lịch chiếu khi ID phim thay đổi
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

  let bookingTicket = () => {
    // Kiểm tra nếu cả 3 giá trị đã được chọn
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

    // Khi cả 3 giá trị đã chọn, hiển thị một nút duy nhất
    return (
      <NavLink to={`/booking/${selectedScheduleId}`}>
        <button className="bg-red-600 w-60 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Buy Ticket Now
        </button>
      </NavLink>
    );
  };

  // Render danh sách phim
  let renderSearchMovie = () => {
    return searchMovie?.map((movie, index) => {
      return (
        <option key={index} value={movie.maPhim}>
          {movie.tenPhim}
        </option>
      );
    });
  };

  // Render lịch chiếu dựa trên kết quả API
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

  let renderMovieDay = () => {
    if (!searchSchedule?.heThongRapChieu?.length) {
      return <option>No time available</option>;
    }

    // Render lịch chiếu từ API
    return searchSchedule.heThongRapChieu.map((heThongRap, index) => {
      return heThongRap.cumRapChieu.map((cumRap, index) => {
        return cumRap.lichChieuPhim.map((lichChieu, index) => (
          <option key={index} value={lichChieu.maLichChieu}>
            {lichChieu.ngayChieuGioChieu}
          </option>
        ));
      });
    });
  };

  // Khi người dùng chọn phim, cập nhật selectedMovieId
  const handleMovieChange = (e) => {
    const movieId = e.target.value;
    setSelectedMovieId(movieId); // Lưu ID phim đã chọn để gọi API
  };
  // Hàm xử lý khi user chọn lịch chiếu
  const handleScheduleChange = (e) => {
    const scheduleId = e.target.value;
    setSelectedScheduleId(scheduleId); // Lưu ID lịch chiếu
  };

  // Hàm xử lý khi user chọn ngày chiếu
  const handleMovieDayChange = (e) => {
    const movieDay = e.target.value;
    setSelectedMovieDay(movieDay); // Lưu ngày chiếu
  };

  return (
    <div className="mx-60 pt-10">
      <div className="grid grid-cols-4 gap-4">
        {/* Select Phim */}
        <form className="w-64 mx-auto">
          <select
            onChange={handleMovieChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option selected>Choose a movie</option>
            {renderSearchMovie()}
          </select>
        </form>

        {/* Select Lịch Chiếu */}
        <form className="w-64 mx-auto">
          <select
            id="schedule"
            onChange={handleScheduleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option selected>Choose a schedule</option>
            {renderSearchSchedule()}
          </select>
        </form>

        {/* Select Ngày */}
        <form className="w-64 mx-auto">
          <select
            id="movie-day"
            onChange={handleMovieDayChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option selected>Movie day</option>
            {renderMovieDay()}
          </select>
        </form>

        {/* Nút mua vé */}
        {bookingTicket()}
      </div>
    </div>
  );
}
