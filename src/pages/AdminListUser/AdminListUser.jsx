import React, { useEffect, useState } from "react";
import { adminService, movieService } from "../../services/movieService";
import {
  Table,
  Tag,
  message,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Layout,
  Menu,
  theme,
  Switch,
  DatePicker,
  InputNumber,
  TimePicker,
  Spin,
  Space,
} from "antd";
import { useDispatch } from "react-redux";
import { turnOffLoading } from "../reduxMovie/spinnerSlice";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import { http } from "../../services/config";
import "aos/dist/aos.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloudUploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import moment from "moment";

export default function AdminListUser() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { Header, Sider, Content } = Layout;
  const [activeContent, setActiveContent] = useState("userTable");
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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

  //#region load data users and admin
  let [listUser, setlistUser] = useState([]);
  let fetchListUser = () => {
    adminService
      .getListUser()
      .then((result) => {
        setlistUser(result.data.content);
      })
      .catch((err) => {
        dispatch(turnOffLoading());
      });
  };
  let [listMovie, setListMovie] = useState([]);
  let fetchListMovie = () => {
    movieService
      .getListMovie()
      .then((result) => {
        setListMovie(result.data.content);
      })
      .catch((err) => {
        dispatch(turnOffLoading());
      });
  };
  useEffect(() => {
    fetchListMovie();
    let userData = localStorage.getItem("DATA_USER");
    if (!userData) {
      navigate("/");
    } else {
      fetchListUser();
    }
    adminService.getTheaterSystem()
    .then((result) => {
      setTheaterSystems(result.data.content);
    }).catch((err) => {
      dispatch(turnOffLoading());
      message.error(t("Get theater system failed"));
    });
  }, []);
  //#endregion

  //#region delete users and admin
  let handleDeleteUser = async (user) => {
    try {
      let result = await adminService.deleteUser(user);
      console.log(" ~ handleDeleteUser ~ result:", result);
      fetchListUser();
      dispatch(turnOffLoading());
      message.success(t("User deleted successfully"));
    } catch (error) {
      dispatch(turnOffLoading());
      console.log("error:", error);
      message.error(t("User deleted failed"));
    }
  };
  //#endregion

  //#region update user
  const handleSubmit = (values) => {
    values.maNhom = "GP00";
    console.log("Submitted values:", values);
    adminService
      .updateUser(values)
      .then((result) => {
        fetchListUser();
        dispatch(turnOffLoading());
        message.success(t("Update successful"));
        setIsModalVisible(false);
      })
      .catch((err) => {
        dispatch(turnOffLoading());
        message.error(t("Update failed"));
      });
  };
  //#endregion

  //#region data user and AdminListUser

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const showRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsModalVisible(false);
    setIsAddMovieModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsModalVisible(false);
    setIsAddMovieModalOpen(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishRegister = (values) => {
    let newUser = { ...values, maNhom: "GP00" };
    console.log("🚀 ~ onFinishRegister ~ newUser:", newUser);
    http
      .post("/api/QuanLyNguoiDung/DangKy", newUser)
      .then((result) => {
        console.log("result:", result);
        message.success(t("Add Success"));
        setIsRegisterModalOpen(false);
      })
      .catch((err) => {
        dispatch(turnOffLoading());
        message.error(t("Add Failed Please Check Your Information"));
      });
  };

  const showModalEdit = (user) => {
    console.log("🚀 ~ showModalEdit ~ user:", user);

    setIsModalVisible(true);
    form.setFieldsValue(user);
  };
  const showAddMovieModal = () => {
    setIsAddMovieModalOpen(true);
  };

  //#endregion

  //#region render data user and AdminListUser
  const columns = [
    {
      title: t("Full name"),
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("Phone number"),
      dataIndex: "soDT",
      key: "soDT",
    },
    {
      title: t("Account"),
      dataIndex: "taiKhoan",
      key: "taiKhoan",
    },
    {
      title: t("Password"),
      dataIndex: "matKhau",
      key: "matKhau",
    },
    {
      title: t("User type"),
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      render: (dataIndex, dataObject) => {
        if (dataObject.maLoaiNguoiDung === "KhachHang") {
          return <Tag color="blue">{t("Customer")}</Tag>;
        } else {
          return <Tag color="red">{t("Admin")}</Tag>;
        }
      },
    },
    {
      title: t("Action"),
      key: "action",
      render: (_, user) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteUser(user.taiKhoan)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              {t("Delete")}
            </button>
            <button
              onClick={() => showModalEdit(user)}
              className="bg-yellow-300 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              {t("Edit")}
            </button>
          </div>
        );
      },
    },
  ];
  //#endregion

  //#region movie management
  const columnsMovie = [
    {
      title: t("Movie ID"),
      dataIndex: "maPhim",
      key: "maPhim",
    },
    {
      title: t("Movie Image"),
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.hinhAnh}
            alt={text}
            className="w-12 h-12 mr-2 object-cover rounded"
          />
        </div>
      ),
    },
    {
      title: t("Movie name"),
      dataIndex: "tenPhim",
      key: "tenPhim",
    },
    {
      title: t("Movie description"),
      dataIndex: "moTa",
      key: "moTa",
      render: (text) => <div className="truncate max-w-xs">{text}</div>,
    },
    {
      title: t("Action"),
      key: "action",
      render: (_, user) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => renderEditMovie(user)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              {t("Edit")}
            </button>
            <button
              onClick={() => deleteMovie(user.maPhim)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              {t("Delete")}
            </button>
            <button
              onClick={() => createShowModal(user.maPhim)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              {t("CreateShow")}
            </button>
          </div>
        );
      },
    },
  ];

  let deleteMovie = (movie) => {
    console.log("🚀 ~ deleteMovie ~ movie:", movie);
    adminService
      .deleteMovie(movie)
      .then((result) => {
        fetchListMovie();
        message.success(t("Delete successful"));
      })
      .catch((err) => {
        message.error(t("Delete failed"));
      });
  };
  //#endregion

  //#region Upload movie
  const formik = useFormik({
    initialValues: {
      tenPhim: "",
      trailer: "",
      moTa: "",
      ngayKhoiChieu: "",
      dangChieu: false,
      sapChieu: false,
      hot: false,
      danhGia: 0,
      hinhAnh: {},
    },
    onSubmit: (values) => {
      values.maNhom = "GP01";
      console.log("Form submitted with values:", values);
      let formData = new FormData();
      for (let key in values) {
        if (key !== "hinhAnh") {
          formData.append(key, values[key]);
        } else {
          formData.append("File", values.hinhAnh, values.hinhAnh.name);
        }
      }

      adminService
        .addMovie(formData)
        .then((result) => {
          console.log("result", result);
          fetchListMovie();
          message.success(t("Upload successful"));
        })
        .catch((err) => {
          console.log("err", err);
          dispatch(turnOffLoading());
          message.error(t("Upload failed"));
        });
    },
  });
  let handleDateChange = (date) => {
    let ngayKhoiChieu = moment(date).format("DD/MM/YYYY");
    formik.setFieldValue("ngayKhoiChieu", ngayKhoiChieu);
  };
  let handleSwitchChange = (name) => {
    return (checked) => {
      formik.setFieldValue(name, checked);
    };
  };
  let handleFileChange = (e) => {
    let file = e.target.files[0];

    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/gif" ||
      file.type === "image/jpg"
    ) {
      if (file.size <= 1024 * 1024) {
        // Check if file size is less than or equal to 1 MB
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        formik.setFieldValue("hinhAnh", file);
      } else {
        message.error(t("Image size must be less than 1 MB"));
        e.target.value = null; // Reset the file input
      }
    } else {
      message.error(
        t("Please upload a valid image file (PNG, JPEG, GIF, or JPG)")
      );
      e.target.value = null; // Reset the file input
    }
  };
  //#endregion

  //#region edit movie
  const [isEditMovieModalVisible, setIsEditMovieModalVisible] = useState(false);
  const [Img, setImg] = useState("");
  const [editForm] = Form.useForm();

  let renderEditMovie = (movie) => {
    setIsEditMovieModalVisible(true);
    editForm.setFieldsValue(movie);
    console.log("🚀 ~ renderEditMovie ~ movie:", movie);
  };

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      maPhim: editForm.getFieldValue("maPhim") || "",
      tenPhim: editForm.getFieldValue("tenPhim") || "",
      trailer: editForm.getFieldValue("trailer") || "",
      moTa: editForm.getFieldValue("moTa") || "",
      ngayKhoiChieu: editForm.getFieldValue("ngayKhoiChieu") || "",
      dangChieu: editForm.getFieldValue("dangChieu") || false,
      sapChieu: editForm.getFieldValue("sapChieu") || false,
      hot: editForm.getFieldValue("hot") || false,
      danhGia: editForm.getFieldValue("danhGia") || 0,
      hinhAnh: null,
    },
    onSubmit: (values) => {
      values.maNhom = "GP01";
      console.log("Form submitted with values:", values);
      let formData = new FormData();
      for (let key in values) {
        if (key !== "hinhAnh") {
          formData.append(key, values[key]);
        } else {
          if (values.hinhAnh !== null) {
            formData.append("File", values.hinhAnh, values.hinhAnh.name);
          }
        }
      }
      adminService
        .editMovie(formData)
        .then((result) => {
          fetchListMovie();
          setIsEditMovieModalVisible(false);
          message.success(t("Update successful"));
          console.log(result.data.message);
        })
        .catch((err) => {
          console.log("err", err.request.response);
          dispatch(turnOffLoading());
          message.error(t("Update failed"));
        });
    },
  });
  let handleDateChangeMovie = (date) => {
    let ngayKhoiChieu = moment(date).format("DD/MM/YYYY");
    editFormik.setFieldValue("ngayKhoiChieu", ngayKhoiChieu);
  };
  let handleFileChangeMovie = (e) => {
    let file = e.target.files[0];

    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/gif" ||
      file.type === "image/jpg"
    ) {
      if (file.size <= 1024 * 1024) {
        // Check if file size is less than or equal to 1 MB
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          setImg(e.target.result);
        };
        editFormik.setFieldValue("hinhAnh", file);
      } else {
        message.error(t("Image size must be less than 1 MB"));
        e.target.value = null; // Reset the file input
      }
    } else {
      message.error(
        t("Please upload a valid image file (PNG, JPEG, GIF, or JPG)")
      );
      e.target.value = null; // Reset the file input
    }
  };
  //#endregion

  //#region create show
  const [isCreateShowModalVisible, setIsCreateShowModalVisible] =
    useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [theaterSystems, setTheaterSystems] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [isLoadingTheaters, setIsLoadingTheaters] = useState(false);

  const showFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      maPhim: selectedMovie,
      ngayChieuGioChieu: "",
      maRap: "",
      giaVe: "",
    },
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        let result = await adminService.addShow(values);
        console.log("result", result);
      } catch (error) {
        console.log("error", error);
        dispatch(turnOffLoading());
        message.error(t("Create show failed"));
      }
    },
  });

  let createShowModal = (movie) => {
    setSelectedMovie(movie);
    setIsCreateShowModalVisible(true);
    showFormik.setFieldValue("maPhim", selectedMovie);
  };

  const handleCreateShowCancel = () => {
    setIsCreateShowModalVisible(false);
  };

  const handleTheaterSystemChange = async (value) => {
    setIsLoadingTheaters(true);
    try {
      let result = await adminService.getTheater(value);
      setTheaters(result.data.content);
    } catch (error) {
      dispatch(turnOffLoading());
      message.error(t("Get theater failed"));
    } finally {
      setIsLoadingTheaters(false);
    }
  };
  const handleTheaterChange = (value) => {
    showFormik.setFieldValue("maRap", value);
  };
  const handleDateTimeChange = (value) => {
    showFormik.setFieldValue("ngayChieuGioChieu", moment(value).format('DD/MM/YYYY HH:mm:ss'));
  };
  const handleTicketPriceChange = (value) => {
    showFormik.setFieldValue("giaVe", value);
  };
  //#endregion

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: t("User Management"),
      onClick: () => setActiveContent("userTable"),
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: t("Movie Management"),
      onClick: () => setActiveContent("movieManagement"),
    },
    {
      key: "3",
      icon: <CloudUploadOutlined />,
      label: t("Upload Movie"),
      onClick: () => setActiveContent("uploadMovie"),
    },
  ];

  return (
    <div data-aos="fade-up" data-aos-delay="500" className="pt-20">
      {/* layout Pages */}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Button onClick={showRegisterModal}>{t("Add")}</Button>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {activeContent === "userTable" && (
              <>
                <Table
                  className="w-full"
                  dataSource={listUser}
                  columns={columns}
                  rowKey="taiKhoan"
                  pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                    className: "py-4",
                  }}
                />
              </>
            )}
            {activeContent === "movieManagement" && (
              <Table
                className="w-full h-full"
                dataSource={listMovie}
                columns={columnsMovie}
                rowKey="taiKhoan"
                pagination={{
                  pageSize: 10,
                  position: ["bottomCenter"],
                  className: "py-4",
                }}
              />
            )}
            {activeContent === "uploadMovie" && (
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">{t("Upload Movie")}</h2>
                <Form layout="vertical" onFinish={formik.handleSubmit}>
                  <Form.Item label={t("Movie Name")} required>
                    <Input
                      name="tenPhim"
                      onChange={formik.handleChange}
                      value={formik.values.tenPhim}
                    />
                  </Form.Item>

                  <Form.Item label={t("Trailer")} required>
                    <Input
                      name="trailer"
                      onChange={formik.handleChange}
                      value={formik.values.trailer}
                    />
                  </Form.Item>

                  <Form.Item label={t("Description")} required>
                    <Input.TextArea
                      name="moTa"
                      onChange={formik.handleChange}
                      value={formik.values.moTa}
                    />
                  </Form.Item>

                  <Form.Item label={t("Release Date")} required>
                    <DatePicker
                      name="ngayKhoiChieu"
                      format={"DD/MM/YYYY"}
                      onChange={handleDateChange}
                    />
                  </Form.Item>

                  <Form.Item label={t("Now Showing")}>
                    <Switch
                      name="dangChieu"
                      onChange={handleSwitchChange("dangChieu")}
                      checked={formik.values.dangChieu}
                    />
                  </Form.Item>

                  <Form.Item label={t("Coming Soon")}>
                    <Switch
                      name="sapChieu"
                      onChange={handleSwitchChange("sapChieu")}
                      checked={formik.values.sapChieu}
                    />
                  </Form.Item>

                  <Form.Item label={t("Hot")}>
                    <Switch
                      name="hot"
                      onChange={handleSwitchChange("hot")}
                      checked={formik.values.hot}
                    />
                  </Form.Item>

                  <Form.Item label={t("Rating")} required>
                    <InputNumber
                      name="danhGia"
                      min={0}
                      max={10}
                      onChange={(value) =>
                        formik.setFieldValue("danhGia", value)
                      }
                      value={formik.values.danhGia}
                    />
                  </Form.Item>

                  <Form.Item label={t("Movie Poster")}>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="mb-2"
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Movie Poster Preview"
                          className="max-w-xs max-h-64 object-contain rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {t("Upload Movie")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
      {/* add user modal */}
      <Modal
        title={t("Add account")}
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
            label={t("Type of user")}
            name="maLoaiNguoiDung"
            rules={[
              { required: true, message: t("Please select type of user!") },
            ]}
          >
            <Select placeholder={t("Type of user")}>
              <Select.Option value="KhachHang">{t("Customer")}</Select.Option>
              <Select.Option value="QuanLy">{t("Admin")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
            layout="vertical"
          >
            <Button block type="primary" htmlType="submit">
              {t("Add")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* edit user modal */}
      <Modal
        title="Update User Info"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            label={t("Type of user")}
            name="maLoaiNguoiDung"
            rules={[
              { required: true, message: t("Please select type of user!") },
            ]}
          >
            <Select placeholder={t("Type of user")}>
              <Select.Option value="KhachHang">{t("Customer")}</Select.Option>
              <Select.Option value="QuanLy">{t("Admin")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Full name"
            name="hoTen"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item className="h-full w-full flex justify-center items-center">
            <Button type="primary" htmlType="submit">
              Update user info
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* edit movie modal */}
      <Modal
        title={t("Edit Movie")}
        visible={isEditMovieModalVisible}
        onCancel={() => setIsEditMovieModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={editFormik.handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <Form.Item label={t("Movie Name")} required>
            <Input
              name="tenPhim"
              onChange={editFormik.handleChange}
              value={editFormik.values.tenPhim}
            />
          </Form.Item>

          <Form.Item label={t("Trailer")} required>
            <Input
              name="trailer"
              onChange={editFormik.handleChange}
              value={editFormik.values.trailer}
            />
          </Form.Item>

          <Form.Item label={t("Description")} required>
            <Input.TextArea
              name="moTa"
              onChange={editFormik.handleChange}
              value={editFormik.values.moTa}
            />
          </Form.Item>

          <Form.Item label={t("Release Date")} required>
            <DatePicker
              name="ngayKhoiChieu"
              format={"DD/MM/YYYY"}
              onChange={handleDateChangeMovie}
            />
          </Form.Item>

          <Form.Item label={t("Now Showing")}>
            <Switch
              name="dangChieu"
              onChange={(checked) =>
                editFormik.setFieldValue("dangChieu", checked)
              }
              checked={editFormik.values.dangChieu}
            />
          </Form.Item>

          <Form.Item label={t("Coming Soon")}>
            <Switch
              name="sapChieu"
              onChange={(checked) =>
                editFormik.setFieldValue("sapChieu", checked)
              }
              checked={editFormik.values.sapChieu}
            />
          </Form.Item>

          <Form.Item label={t("Hot")}>
            <Switch
              name="hot"
              onChange={(checked) => editFormik.setFieldValue("hot", checked)}
              checked={editFormik.values.hot}
            />
          </Form.Item>

          <Form.Item label={t("Rating")} required>
            <InputNumber
              name="danhGia"
              min={0}
              max={10}
              onChange={(value) => editFormik.setFieldValue("danhGia", value)}
              value={editFormik.values.danhGia}
            />
          </Form.Item>

          <Form.Item label={t("Movie Poster")} className="col-span-2">
            <input
              type="file"
              onChange={handleFileChangeMovie}
              className="mb-2"
            />
            {Img && (
              <div className="mt-2">
                <img
                  src={Img}
                  alt="Movie Poster Preview"
                  className="max-w-xs max-h-64 object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          </Form.Item>

          <Form.Item className="col-span-2">
            <Button type="primary" htmlType="submit" block>
              {t("Update Movie")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* create show and ticket */}
      <Modal
        title={t("Create Show")}
        visible={isCreateShowModalVisible}
        onCancel={handleCreateShowCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={showFormik.handleSubmit}>
          <Form.Item label={t("Theater System")} required>
            <Select
              placeholder={t("Select theater system")}
              onChange={handleTheaterSystemChange}
            >
              {theaterSystems.map((system) => (
                <Select.Option key={system.id} value={system.maHeThongRap}>
                  {system.maHeThongRap}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t("Theater")} required>
            {isLoadingTheaters ? (
              <Spin />
            ) : (
              <Select
                placeholder={t("Select theater")}
                onChange={handleTheaterChange}
              >
                {theaters.map((theater) => (
                  <Select.Option key={theater.id} value={theater.maCumRap}>
                    {theater.tenCumRap}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label={t("Show Date and Time")} required>
             <DatePicker showTime onChange={handleDateTimeChange} />
          </Form.Item>

          <Form.Item label={t("Ticket Price")}>
            <InputNumber
              min={75000}
              max={120000}
              step={5000}
              style={{ width: "100%" }}
              onChange={handleTicketPriceChange}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("Add Show of Movie")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
