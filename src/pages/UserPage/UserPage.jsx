import React, { useState, useEffect } from "react";
import { adminService, movieService } from "../../services/movieService";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";
import { Form, Button, Input } from "antd";
import { message } from "antd/es";

export default function UserPage() {
  const { t, i18n } = useTranslation();
  let [user, setuser] = useState({});
  const [userInfo, setUserInfo] = useState([]);
  const [ticketInfo, setTicketInfo] = useState({});
  // AOS animation
  useEffect(() => {
    AOS.init({
      offset: 400,
      delay: 500,
      duration: 1000,
      easing: "ease",
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

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    values.maNhom = "GP00";
    console.log("Submitted values:", values);
    adminService.updateUser(values)
    .then((result) => {
      message.success(t("Update successful"));
    }).catch((err) => {
      message.error(t("Update failed"));
    })
  }

  let foundUser = userInfo.find((item) => item.taiKhoan == user);
  useEffect(() => {
    if (foundUser) {
      movieService.getTicket(foundUser)
        .then((result) => {
          setTicketInfo(result.data.content);
        }).catch((err) => {
          console.log('err:', err);
        });
    }
  }, [foundUser]);

  let renderTicket = () => {
    if (!ticketInfo.thongTinDatVe || ticketInfo.thongTinDatVe.length === 0) {
      return <p>{t("No booking history available.")}</p>;
    }

    return ticketInfo.thongTinDatVe.map((ticket, index) => (
      <div key={index} className="py-2">
        <p>{t("Booking date")}: {new Date(ticket.ngayDat).toLocaleString()}</p>
        <p className="text-color">{t("Movie name")}: {ticket.tenPhim}</p>
        <p className="text-nowrap">
          <span>{t("Duration")}: {ticket.thoiLuongPhim} {t("minutes")}</span>
          {ticket.giaVe && <span>, {t("Ticket price")}: {(ticket.giaVe * ticket.danhSachGhe.length).toLocaleString()} VND</span>}
        </p>
        <p className="text-green-500">{t("Theater")}: {ticket.danhSachGhe[0].tenHeThongRap}</p>
        <p className="text-nowrap mb-2">
          <span>{t("Schedule")}: {ticket.danhSachGhe[0].tenRap}</span>,
          <span> {t("Chair")}: {ticket.danhSachGhe.map(ghe => ghe.tenGhe).join(', ')}</span>
        </p>
        <hr className="hr" />
      </div>
    ));
  };
  //#region User Info
  let renderUser = () => {
    let foundUser = userInfo.find((item) => item.taiKhoan == user);
    return foundUser ? (
      <div className="w-4/5 h-4/5 p-4 bg-white rounded mt-10 mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            taiKhoan: foundUser.taiKhoan,
            matKhau: foundUser.matKhau,
            email: foundUser.email,
            soDt: foundUser.soDT,
            maLoaiNguoiDung: foundUser.maLoaiNguoiDung,
            hoTen: foundUser.hoTen,
          }}
          
        >
          <Form.Item
            label="Account"
            name="taiKhoan"
            rules={[{ required: true, message: "Please enter your account!" }]}
          >
            <Input placeholder="Enter your account" disabled />
          </Form.Item>

          <Form.Item
            label="Password"
            name="matKhau"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="soDt"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            label="User type"
            name="maLoaiNguoiDung"
            rules={[
              { required: true, message: "Please enter your user type!" },
            ]}
          >
            <Input placeholder="Enter your user type" disabled />
          </Form.Item>

          <Form.Item
            label="Full name"
            name="hoTen"
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item className="h-full w-full flex justify-center items-center">
            <Button type="primary" htmlType="submit">
              Update user info
            </Button>
          </Form.Item>
        </Form>
      </div>
    ) : (
      <p>{t("User not found.")}</p>
    );
  };
  //#endregion

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="500"
      className="grid grid-cols-2 h-screen pt-20"
    >
      {/* User Info */}
      {renderUser()}
      {/* Ticket Info */}
      <div
        data-aos="fade-up"
        data-aos-delay="700"
        className="w-3/4 h-3/4 p-4 bg-white rounded mt-10 mx-auto"
      >
        <h2 className="text-center px-4 pb-4 text-3xl text-color">
          {t("Booking history")}
        </h2>
        <hr className="hr" />
        <div>
          {renderTicket()}
        </div>
      </div>
    </div>
  );
}
