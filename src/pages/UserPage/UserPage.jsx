import React, { useState, useEffect } from "react";
import { adminService } from "../../services/movieService";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function UserPage() {
  let [user, setuser] = useState({});
  const [userInfo, setUserInfo] = useState([]);
    // AOS animation
    useEffect(() => {
      AOS.init({
        offset: 400,
        delay: 500,
        duration: 1000,
        easing: 'ease',
        once: true,
      });
      AOS.refresh();
    }, []);
    // get user info API
  useEffect(() => {
    let dataUser = JSON.parse(localStorage.getItem("DATA_USER"));
    if (dataUser) {
      setuser(dataUser.taiKhoan);
    }
    adminService
      .findUser()
      .then((result) => {
        setUserInfo(result.data.content);
      })
      .catch((err) => {});
  }, []);
  //#region User Info
  let renderUser = () => {
    let foundUser = userInfo.find((item) => item.taiKhoan == user);
    return foundUser ? (
      <div>
        <form
          className="w-2/4 mx-auto bg-white rounded p-4 
      grid grid-cols-2 gap-4"
        >
          <div>
            <label
              htmlFor="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Account
            </label>
            <input
              value={foundUser.taiKhoan}
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              value={foundUser.matKhau}
              type="password"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              value={foundUser.hoTen}
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              value={foundUser.email}
              type="email"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone Number
            </label>
            <input
              value={foundUser.soDT}
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Type user
            </label>
            <input
              value={foundUser.maLoaiNguoiDung}
              type="text"
              id="userInfomall-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
              disabled
            />
          </div>
          <div></div>
          <button className="bg-button p-2 rounded text-white hover:bg-orange-600">
            Update
          </button>
        </form>
      </div>
    ) : (
      <p>Không tìm thấy người dùng.</p>
    );
  };
  //#endregion
  
  return (
    <div data-aos="fade-up" data-aos-delay="500" className="bg-layout h-screen pt-20">
      {/* User Info */}
      {renderUser()}
      {/* Ticket Info */}
      <div data-aos="fade-up" data-aos-delay="800" className="w-2/4 p-4 bg-white rounded mt-10 mx-auto">
        <h2 className="text-center px-4 pb-4 text-3xl text-color">
          Booking history
        </h2>
        <hr className="hr" />
        <div className="grid grid-cols-2">
          <div className="py-2">
            <p>Booking date: </p>
            <p className="text-color ">Movie name: </p>
            <p className="text-nowrap">
              <span>Duration: 120 minutes</span>,<span>Ticket price: </span>
            </p>
            <p className="text-green-500">Theater: </p>
            <p className="text-nowrap mb-2">
              <span>Schedule: </span>,<span>Chair: </span>
            </p>
            <hr className="hr" />
          </div>
          <div className="py-2">
            <p>Booking date: </p>
            <p className="text-color ">Movie name: </p>
            <p className="text-nowrap">
              <span>Duration: 120 minutes</span>,<span>Ticket price: </span>
            </p>
            <p className="text-green-500">Theater: </p>
            <p className="text-nowrap mb-2">
              <span>Schedule: </span>,<span>Chair: </span>
            </p>
            <hr className="hr" />
          </div>
        </div>
      </div>
    </div>
  );
}
