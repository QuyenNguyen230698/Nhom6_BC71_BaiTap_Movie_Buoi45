import React, { useState } from "react";
import { Switch, Button, Modal, Checkbox, Form, Input, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { http } from "../services/config";
import { setUserAction } from "../pages/reduxMovie/userSlice";
import { turnOffLoading } from "../pages/reduxMovie/spinnerSlice";

export default function Header() {
  let user = useSelector((state) => state.userSlice.dataLogin);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  //#region modal show Login and register
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsRegisterModalOpen(false);
  };
  //#endregion

  //#region Load API Login and register
  const onFinish = (values) => {
    console.log("Success:", values);
    http
      .post("/api/QuanLyNguoiDung/DangNhap", values)
      .then((result) => {
        console.log("values:", values);
        dispatch(setUserAction(result.data.content));
        let dataUser = JSON.stringify(result.data.content);
        localStorage.setItem("DATA_USER", dataUser);

        if (result.data.content.maLoaiNguoiDung == "QuanTri") {
          setIsModalOpen(false);
          navigate("/list-user");
        } else {
          setIsModalOpen(false);
          navigate("/");
        }
        dispatch(turnOffLoading());
        message.success("Login Success ! Welcome to Like Flix");
      })
      .catch((err) => {
        dispatch(turnOffLoading());
        message.error("Account or password is incorrect !");
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishRegister = (values) => {
    http
      .post("/api/QuanLyNguoiDung/DangKy", values)
      .then((result) => {
        message.success("Registration Success");
        setIsRegisterModalOpen(false);
      })
      .catch((err) => {
        message.error("Registration Failed");
      });
  };
  //#endregion

  //#region render Admin page and User page
  let renderAdminPage = () => {
    if (user.maLoaiNguoiDung === "QuanTri") {
      return (
        <div className="flex font-medium p-4 md:p-0 mt-4   md:mt-0 md:bg-white ">
          <NavLink
            to="/list-user"
            className="px-3 mt-3 text-gray-900 md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700"
          >
            Hi,{user.taiKhoan}
          </NavLink>
        </div>
      );
    } else {
      return <strong className="mt-3">Hi,{user.taiKhoan}</strong>;
    }
  };
  let renderUser = () => {
    if (user) {
      return (
        <>
          {renderAdminPage()}
          <div className=" text-gray-900 md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700">
            <button onClick={handleLogout} className=" py-2 px-3 text-xl flex">
              <svg
                className="h-8 w-8 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className=" text-gray-900 md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700">
            <button onClick={showModal} className=" py-2 px-3 text-xl flex">
              <svg
                className="h-8 w-8 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Login</span>
            </button>
          </div>
          <div className=" text-gray-900 md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700">
            <button
              onClick={showRegisterModal}
              className="py-2 px-3 text-xl flex"
            >
              <svg
                className="h-8 w-8 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Register</span>
            </button>
          </div>
        </>
      );
    }
  };
  //#endregion

  //#region i18n changeLanguages
  const [theme, setTheme] = useState("EN");
  const changeTheme = (value) => {
    setTheme(value ? "EN" : "VN");
  };
  //#endregion

  let handleLogout = () => {
    localStorage.removeItem("DATA_USER");
    window.location.href = "/";
  };

  return (
    <div>
      {/* Navbar menu */}
      <nav className="fixed z-50 w-full top-0 left-0 border-gray-200 bg-white opacity-90">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink to="/" className="flex items-center rtl:space-x-reverse">
            <img
              src="https://fellowstudio.com/wp-content/uploads/2023/08/Netflix-Logo-2006-500x333-1.png"
              className="h-12"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              <span className="uppercase tracking-wide text-red-700">
                Like Flix
              </span>
              <p
                className="text-sm tracking-tighter"
                style={{ color: "#A6A5A3" }}
              >
                Watch movie faster
              </p>
            </span>
          </NavLink>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="flex text-center">{renderUser()}</div>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  Movie Schedule
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Theater Complex
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  News
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Application
                </a>
              </li>
              <li>
                <Switch
                  checked={theme === "EN"}
                  onChange={changeTheme}
                  checkedChildren="EN"
                  unCheckedChildren="VN"
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <>
        {/* Modal show Login */}
        <Modal
          title="Login"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            name="basic"
            layout="vertical"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
              taiKhoan: "admin321",
              matKhau: "123",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="taiKhoan"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="matKhau"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
              layout="vertical"
            >
              <Button block type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
      {/* Modal show Register */}
      <Modal
        title="Register"
        open={isRegisterModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="register"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 24,
          }}
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinishRegister}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            label="Username"
            name="taiKhoan"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="matKhau"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Full name"
            name="hoTen"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="soDT"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
            layout="vertical"
          >
            <Button block type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
