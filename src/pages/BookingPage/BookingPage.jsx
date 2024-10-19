import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { movieService } from '../../services/movieService';

export default function BookingPage() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [listChair, setlistChair] = useState([]);
    const [movieInfo, setMovieInfo] = useState({});
    let { id } = useParams();
  
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
  
    return (
      <div className="pt-20 ">
        <div className="flex justify-between p-5 h-96">
          <div className="w-2/3 p-2">
            <div className="bg-gray-800 py-2 rounded text-white text-center">
              Screen
            </div>
            <div className='mt-4'>
              <div className="grid grid-cols-10 gap-3 mx-48">
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
                    className="p-1 w-14 h-8 rounded"
                    style={{ backgroundColor: "#0B192C" }}
                    disabled
                  ></button>
                  <p>Placed</p>
                </div>
                <div className="text-center">
                  <button
                    className="p-1 w-14 h-8 rounded"
                    style={{ backgroundColor: "#FFD700" }}
                    disabled
                  ></button>
                  <p>Vip</p>
                </div>
                <div className="text-center">
                  <button
                    className="p-1 w-14 h-8 rounded"
                    style={{ backgroundColor: "#ddd" }}
                    disabled
                  ></button>
                  <p>Normal</p>
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
                <h3 className='font-medium'>Theater Cluster:</h3>
                <h3 className='text-color font-medium'>{movieInfo.tenCumRap}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>Address:</h3>
                <h3 className='text-color font-medium'>{movieInfo.diaChi}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>Theater:</h3>
                <h3 className='text-color font-medium'>{movieInfo.tenRap}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>Movie show date and time:</h3>
                <h3 className='text-color font-medium'>
                {movieInfo.ngayChieu} - 
                <span className='text-green-500'> {movieInfo.gioChieu}</span>
                </h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
                <h3 className='font-medium'>Movie Name:</h3>
                <h3 className='text-color font-medium'>{movieInfo.tenPhim}</h3>
            </div>
            <hr className='hr'/>
            <div className='flex justify-between py-6 px-4'>
            <h3 className='font-medium text-nowrap'>Number of seats selected:  </h3>
            <h3 className='text-color font-medium'>{selectedSeats.map((ghe) => ghe.tenGhe).join(", ")}</h3>
            </div>
            <hr className='hr'/>
            <button className="w-full py-6 text-2xl bg-orange-500 hover:bg-orange-600 text-white mt-5 cursor-pointer">
            Book tickets
            </button>
          </div>
        </div>
      </div>
    );
  };
