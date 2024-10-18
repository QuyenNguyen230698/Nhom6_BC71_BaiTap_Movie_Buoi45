import React, { useState, useEffect } from "react";
import { useNavigate, useParams,NavLink } from "react-router-dom";
import { Progress, Tabs } from "antd";
import { movieService } from "../../services/movieService";
import moment from "moment";

//#region creative item to render day and time bookticket
const ItemDay = ({ cinema }) => {
  return (
    <div className="flex space-x-3 p-2">
      <div className="grid grid-cols-4 gap-6 ml-2">
      {cinema.lichChieuPhim && cinema.lichChieuPhim.length > 0 ? (
  cinema.lichChieuPhim.slice(0, 4).map((movieSchedule, index) => {
    return (
      <NavLink key={index} to={`/booking/${movieSchedule.maLichChieu}`}>
      <div 
        className="bg-slate-100 text-black px-5 py-2 rounded border-gray-200 border text-nowrap w-40 hover:font-medium hover:bg-gray-100 hover:w-40">
        <span className="text-green-600">
          {moment(movieSchedule.ngayChieuGioChieu).format("ddd,DD/MM")}
        </span>
        <span> ~ </span>
        <span className="text-red-500">
          {moment(movieSchedule.ngayChieuGioChieu).format("HH:mm")}
        </span>
        </div>
      </NavLink>
    );
  })
) : (
  <p className="text-red-500">There is no movie showing date yet</p>
)}
        </div>
    </div>
  );
};
//#endregion

export default function DetailPage() {
  let [detail, setdetail] = useState({});
  let [schedules, setSchedules] = useState([]);
  let params = useParams();
  let { id } = params;
  let navigate = useNavigate();
  let handleGoBack = () => {
    navigate("/");
  };
//#region load API detail and Schedule
useEffect(() => {
  movieService
    .getDetailSchedule(id)
    .then((result) => {
      setdetail(result.data.content);
      setSchedules(result.data.content.heThongRapChieu);
    })
    .catch((err) => {});
}, [id]);
//#endregion

//#region render detail movie
let renderDetailMovie = () => {
  return (
    <div className="flex flex-col items-center rounded-lg shadow md:flex-row md:max-w-9xl border-gray-700 bg-gray-800 h-96 border">
      <img
        className="object-cover w-full rounded-t-lg md:w-80 md:rounded-none md:rounded-s-lg h-96"
        src={detail.hinhAnh}
        alt="true"
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200 dark:text-white">
          {detail.tenPhim}
        </h5>
        <p className="mb-3 font-normal text-gray-400 dark:text-gray-100">
          {detail.moTa}
        </p>
        <button
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          <a href="#buyTicket" className="duration-1000">Buy ticket</a>
        </button>
        <button
          onClick={handleGoBack}
          type="button"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Go back
        </button>
      </div>
      <div>
        <Progress
          type="circle"
          strokeWidth={10}
          percent={detail.danhGia * 10}
          size={120}
          format={() => (
            <span className="text-base font-medium text-green-600">
              {detail.danhGia}/10 Rate
            </span>
          )}
        />
      </div>
    </div>
  );
};
//#endregion

//#region render schedule
let renderSchedule = () => {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return [
      {
        key: "no-schedule",
        label: 'No schedules available',
        children: [
          <div className="text-center text-2xl font-bold">
            <span>
            There is no movie showing date yet
            </span>
          </div>
        ],
      }
    ];
  }
  return schedules.map((cinemaSystem) => {
    return {
      key: cinemaSystem.maHeThongRap,
      label: (
        <img
          style={{ width: 50, height: 50 }}
          src={cinemaSystem.logo}
          alt=""
          className="mt-1"
        />
      ),
      children: cinemaSystem.cumRapChieu?.map((cinema, index) => {
        return <ItemDay key={index} cinema={cinema} />;
      }),
    };
  });
};
//#endregion

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div className=" container pt-20">
      {renderDetailMovie()}
      <div id="buyTicket" className="mt-20 pt-4 border border-gray-300">
        <Tabs
          defaultActiveKey="1"
          items={renderSchedule()}
          onChange={onChange}
          tabPosition="left"
          style={{ height: "300px" }}
          className="overflow-hidden"
        />
      </div>
    </div>
  );
}
