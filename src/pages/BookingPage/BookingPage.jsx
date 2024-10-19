import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { movieService } from "../../services/movieService";

const BookingTicketComponent = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [listChair, setlistChair] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    // Fetching seat data from the API
    movieService
      .getBookTicket(id)
      .then((result) => {
        setlistChair(result.data.content.danhSachGhe);
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
    <div className="mt-20">
        <div className="flex justify-between p-5 h-96">
      <div className="w-2/3 p-2">
        <div className="w-1/3 text-center">Screen</div>
        <h2>Danh sách ghế</h2>
        <div className="grid grid-cols-10 gap-3 mx-48">
          {listChair.map((ghe) => (
            <button
              className="p-1 cursor-pointer border rounded"
              key={ghe.maGhe}
              onClick={() => handleSelectSeat(ghe)}
              disabled={ghe.daDat}
              style={{
                backgroundColor: ghe.daDat
                  ? "#0B192C" // Màu đỏ nếu ghế đã đặt
                  : selectedSeats.includes(ghe)
                  ? "#FF6500" // Màu xanh nếu ghế đã chọn
                  : "#ddd",
                color: ghe.daDat
                ? "#1E3E62" // Màu đỏ nếu ghế đã đặt
                : selectedSeats.includes(ghe)
                ? "#fff" // Màu xanh nếu ghế đã chọn
                : "#000000",
              }}
            >
              {ghe.tenGhe}
            </button>
          ))}
        </div>
      </div>

      {/* Tổng số tiền */}
      <div className="w-1/3 p-2 rounded-l-sm">
        <h2>Thông tin vé</h2>
        <p>
          Số ghế đã chọn: {selectedSeats.map((ghe) => ghe.tenGhe).join(", ")}
        </p>
        <p>Tổng tiền: {totalPrice.toLocaleString()} VND</p>
        <button className="px-5 py-2 bg-green-500 text-white rounded-md mt-5 cursor-pointer">
          Đặt vé
        </button>
      </div>
    </div>
    </div>
  );
};
export default BookingTicketComponent;
