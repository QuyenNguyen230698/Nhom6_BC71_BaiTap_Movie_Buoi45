import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { movieService } from '../../services/movieService';
import { message } from 'antd';
import AOS from 'aos';
import {useTranslation} from 'react-i18next';
import 'aos/dist/aos.css';

export default function BookingPage() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [listChair, setlistChair] = useState([]);
    const [movieInfo, setMovieInfo] = useState({});
    let { id } = useParams();
    const { t, i18n } = useTranslation();
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
  
    useEffect(() => {
      // Fetching seat data from the API
      movieService
        .getBookTicket(id)
        .then((result) => {
          setlistChair(result.data.content.danhSachGhe);
          setMovieInfo(result.data.content.thongTinPhim);
        })
        .catch((err) => {
          console.error("Error fetching seat data", err);
        });
    }, [id]);
  
    // Hàm để chọn ghế
    const handleSelectSeat = (ghe) => {
      if (selectedSeats.includes(ghe)) {
        setSelectedSeats(selectedSeats.filter((item) => item !== ghe));
      } else {
        setSelectedSeats([...selectedSeats, ghe]);
      }
    };
    const totalPrice = selectedSeats.reduce(
      (total, seat) => total + seat.giaVe,
      0
    );

    const handleBookTicket = () => {
        const user = JSON.parse(localStorage.getItem("DATA_USER"));
        const bookingInfo = {
            taiKhoanNguoiDung:user?.taiKhoan,
            maLichChieu:movieInfo.maLichChieu,
            danhSachVe:selectedSeats.map((ghe) => ({
                maGhe: ghe.maGhe,
                tenGhe: ghe.tenGhe,
                maRap: ghe.maRap,
                loaiGhe: ghe.loaiGhe,
                stt: ghe.stt,
                giaVe: ghe.giaVe,
                daDat: ghe.daDat,
                taiKhoanNguoiDat: ghe.taiKhoanNguoiDat, 
            }))
        };
        message.success(t("Booking successful"));
        console.log('Booking Information:', bookingInfo)
      };
  
    return (
      <div data-aos="fade-up" data-aos-delay="500" className="pt-20 bg-layout h-screen">
        <div className="flex justify-between p-5 h-96">
            
          <div className="w-2/3 p-2">
            <div className="bg-gray-800 py-2 rounded text-white text-center">
              {t("Screen")}
            </div>
            <div className='mt-4'>
              <div className="container-theater gap-3 container">
                {listChair.map((ghe) => (
                  <button
                    className="p-1 cursor-pointer border rounded"
                    key={ghe.maGhe}
                    onClick={() => handleSelectSeat(ghe)}
                    disabled={ghe.daDat}
                    style={{
                      backgroundColor: ghe.daDat
                        ? "#0B192C"
                        : selectedSeats.includes(ghe)
                        ? "#FF6500"
                        : ghe.loaiGhe === "Vip"
                        ? "#FFD700"
                        : "#ddd", 
                      color: ghe.daDat
                        ? "#1E3E62"
                        : selectedSeats.includes(ghe)
                        ? "#fff"
                        : ghe.loaiGhe === "Vip"
                        ? "#000000" 
                        : "#000000", 
                    }}
                  >
                    {ghe.tenGhe}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-4 my-8 text-white">
                <div className="text-center ">
                  <button
                    className="p-1 w-10 h-8 rounded"
                    style={{ backgroundColor: "#0B192C" }}
                    disabled
                  ></button>
                  <p>{t("Placed")}</p>
                </div>
                <div className="text-center">
                  <button
                    className="p-1 w-10 h-8 rounded"
                    style={{ backgroundColor: "#FFD700" }}
                    disabled
                  ></button>
                  <p>Vip</p>
                </div>
                <div className="text-center">
                  <button
                    className="p-1 w-10 h-8 rounded"
                    style={{ backgroundColor: "#ddd" }}
                    disabled
                  ></button>
                  <p>{t("Normal")}</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Total price */}
          <div className="w-1/3 p-4 rounded bg-white shadow h-fit">
            <h2 className='text-center px-4 py-7 text-5xl text-color'>
             {totalPrice.toLocaleString()}VND
            </h2>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>{t("Theater Cluster")}:</h3>
                <h3 className='text-color font-medium'>{movieInfo.tenCumRap}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>{t("Address")}:</h3>
                <h3 className='text-color font-medium'>{movieInfo.diaChi}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>{t("Theater")}:</h3>
                <h3 className='text-color font-medium'>{movieInfo.tenRap}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>{t("Movie show date and time")}:</h3>
                <h3 className='text-color font-medium'>
                {movieInfo.ngayChieu} - 
                <span className='text-green-500'> {movieInfo.gioChieu}</span>
                </h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>{t("Movie Name")}:</h3>
                <h3 className='text-color font-medium'>{movieInfo.tenPhim}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
            <h3 className='font-medium text-nowrap'>{t("Number of seats selected")}:  </h3>
            <h3 className='text-color font-medium'>{selectedSeats.map((ghe) => ghe.tenGhe).join(", ")}</h3>
            </div>
            <hr className='hr'/>
            <button 
            onClick={handleBookTicket}
            className="w-full py-6 text-2xl bg-red-600 hover:bg-red-700 text-white mt-5 cursor-pointer">
            {t("Book tickets")}
            </button>
          </div>
        </div>
      </div>
    );
  };
