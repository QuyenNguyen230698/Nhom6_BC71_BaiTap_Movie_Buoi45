import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import moment from "moment";
import { movieService } from "../../services/movieService";
import { NavLink } from "react-router-dom";

const ItemMovie = ({ movie }) => {
  return (
    <div className="flex space-x-3 border-b border-gray-300 p-2">
      <img src={movie.hinhAnh} className="w-28" alt="" />
      <div>
        <h2 className="text-lg font-semibold ml-2 mb-2">{movie.tenPhim}</h2>
        <div className="grid grid-cols-2 gap-3 ml-2">
          {movie.lstLichChieuTheoPhim
            .slice(0, 4)
            .map((movieSchedule, index) => {
              return (
                <NavLink key={index} to={`/booking/${movieSchedule.maLichChieu}`}>
                  <span
                  className="bg-slate-100 text-black px-5 py-2 rounded border-gray-200 border text-nowrap w-40 hover:font-medium hover:bg-gray-100 hover:w-40"
                >
                  <span className="text-green-600">
                    {moment(movieSchedule.ngayChieuGioChieu).format(
                      "ddd,DD/MM"
                    )}
                  </span>
                  <span> ~ </span>
                  <span className="text-red-500">
                    {moment(movieSchedule.ngayChieuGioChieu).format("HH:mm")}
                  </span>
                </span>
                </NavLink>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default function TabMoviePage() {
  const onChange = (key) => {
    console.log(key);
  };
  let [renderTab, setrenderTab] = useState();
  useEffect(() => {
    movieService
      .getTheaterMovie()
      .then((result) => {
        setrenderTab(result.data.content);
      })
      .catch((err) => {});
  }, []);
  let renderTheater = (theaterSystem) => {
    return theaterSystem.lstCumRap.map((theaterComplex, index) => {
      return {
        key: index,
        label: (
          <div className="text-left w-80 text-lg border-b border-gray-300">
            <h4 className="truncate text-green-600 uppercase">
              {theaterComplex.tenCumRap}
            </h4>
            <p className="truncate text-sm text-gray-400">
              {theaterComplex.diaChi}
            </p>
          </div>
        ),
        children: (
          <div style={{ height: "600px" }} className="overflow-y-scroll">
            {theaterComplex.danhSachPhim.map((movie) => {
              return <ItemMovie key={movie.maPhim} movie={movie} />;
            })}
          </div>
        ),
      };
    });
  };
  let renderListTheater = () => {
    return renderTab?.map((theater) => {
      return {
        key: theater.maHeThongRap,
        label: (
          <img
            style={{ width: 50, height: 50 }}
            src={theater.logo}
            alt=""
            className="mt-1"
          />
        ),
        children: (
          <Tabs
            defaultActiveKey="1"
            items={renderTheater(theater)}
            onChange={onChange}
            tabPosition="left"
            style={{ height: "600px" }}
            className="overflow-hidden"
          />
        ),
      };
    });
  };
  return (
    <div className="mx-64 pt-20">
      <Tabs
        defaultActiveKey="1"
        items={renderListTheater()}
        onChange={onChange}
        tabPosition="left"
        style={{ height: "600px" }}
        className="border border-gray-300 overflow-hidden"
      />
    </div>
  );
}
