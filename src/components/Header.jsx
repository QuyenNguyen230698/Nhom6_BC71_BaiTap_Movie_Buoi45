import { useState, useEffect } from "react";
import { Switch, Button, Modal, Checkbox, Form, Input, message, Select } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { http } from "../services/config";
import { setUserAction } from "../pages/reduxMovie/userSlice";
import { turnOffLoading } from "../pages/reduxMovie/spinnerSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

export default function Header() {
  let user = useSelector((state) => state.userSlice.dataLogin);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  // AOS animation
  useEffect(() => {
    AOS.init({
      offset: 1000,
      delay: 0,
      duration: 1000,
      easing: "ease",
      once: true,
    });
    AOS.refresh();
  }, []);

  // i18n change language
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to "EN"
    return localStorage.getItem("language") === "vn" ? "VN" : "EN";
  });

  useEffect(() => {
    // Set initial language when component mounts
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
    setTheme(savedLanguage === "en" ? "EN" : "VN");
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); // Save language choice to localStorage
  };

  const changeTheme = (value) => {
    const newTheme = value ? "EN" : "VN";
    setTheme(newTheme);
    changeLanguage(value ? "en" : "vn");
  };

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
          window.location.href = "/list-user";
        } else {
          setIsModalOpen(false);
          window.location.href = "/user";
        }
        dispatch(turnOffLoading());
        message.success(t("Login Success ! Welcome to Like Flix"));
      })
      .catch((err) => {
        dispatch(turnOffLoading());
        message.error(t("Account or password is incorrect !"));
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishRegister = (values) => {
    let newUser = {...values, maNhom: "GP00" }
    console.log("🚀 ~ onFinishRegister ~ newUser:", newUser)
    http
      .post("/api/QuanLyNguoiDung/DangKy", newUser)
      .then((result) => {
        console.log("result:", result);
        message.success(t("Registration Success"));
        setIsRegisterModalOpen(false);
      })
      .catch((err) => {
        dispatch(turnOffLoading());
        message.error(t("Registration Failed Please Check Your Information"));
      });
  };
  //#endregion

  //#region render Admin page and User page
  let renderAdminPage = () => {
    if (user.maLoaiNguoiDung === "QuanTri") {
      return (
        <div
          data-aos="fade-left"
          data-aos-delay="1000"
          className="flex font-medium p-4 md:p-0 mt-4 md:mt-0 bg-navbar"
        >
          <NavLink
            to="/list-user"
            className="px-3 mt-3 text-white md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700 cursor-pointer"
          >
            {t("Hi")},{user.taiKhoan}
          </NavLink>
        </div>
      );
    } else {
      return (
        <div
          data-aos="fade-left"
          data-aos-delay="1000"
          className="flex font-medium p-4 md:p-0 mt-4 md:mt-0 bg-navbar"
        >
          <NavLink
            to="/user"
            className="px-3 mt-3 text-white md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700 cursor-pointer"
          >
            {t("Hi")},{user.taiKhoan}
          </NavLink>
        </div>
      );
    }
  };
  let renderUser = () => {
    if (user) {
      return (
        <>
          {renderAdminPage()}
          <div
            data-aos="fade-left"
            data-aos-delay="1500"
            className=" bg-navbar cursor-pointer text-white md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700"
          >
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
              <span>{t("Logout")}</span>
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            data-aos="fade-left"
            data-aos-delay="1000"
            className=" text-white cursor-pointer md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700"
          >
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
              <span>{t("Login")}</span>
            </button>
          </div>
          <div
            data-aos="fade-left"
            data-aos-delay="1500"
            className=" text-white cursor-pointer md:hover:text-red-700 md:p-0 dark:hover:bg-gray-700"
          >
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
              <span>{t("Register")}</span>
            </button>
          </div>
        </>
      );
    }
  };
  //#endregion

  let handleLogout = () => {
    localStorage.removeItem("DATA_USER");
    window.location.href = "/";
  };

  return (
    <div>
      {/* Navbar menu */}
      <nav className="fixed z-50 w-full top-0 left-0 border-gray-200 opacity-90 bg-navbar">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink
            to="/"
            data-aos="fade-right"
            data-aos-delay="1500"
            className="flex items-center rtl:space-x-reverse"
          >
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
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-navbar">
              <li data-aos="fade-right" data-aos-delay="1000">
                <a
                  href="#listMovie"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  {t("Showtimes")}
                </a>
              </li>
              <li data-aos="fade-right" data-aos-delay="500">
                <a
                  href="#tabMovie"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  {t("Theaters")}
                </a>
              </li>
              <li data-aos="fade-right" data-aos-delay="300">
                <a
                  href="#carousel"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  {t("News")}
                </a>
              </li>
              <li data-aos="fade-left" data-aos-delay="300">
                <a
                  href="#footer"
                  className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  {t("About us")}
                </a>
              </li>
              <li data-aos="fade-left" data-aos-delay="500">
                <Switch
                  checked={theme === "EN"}
                  onChange={(checked) => {
                    changeTheme(checked);
                  }}
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
          title={t("Login")}
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
              taiKhoan: "bao12",
              matKhau: "Bao@12345",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={t("Account")}
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
              label={t("Password")}
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
              name={t("remember")}
              valuePropName="checked"
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
            >
              <Checkbox>{t("remember")}</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
              layout="vertical"
            >
              <Button block type="primary" htmlType="submit">
                {t("Login")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
      {/* Modal show Register */}
      <Modal
        title={t("Register")}
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
            label={t("Account")}
            name="taiKhoan"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Password")}
            name="matKhau"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t("Full name")}
            name="hoTen"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Email")}
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Phone number")}
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
              {t("Register")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
