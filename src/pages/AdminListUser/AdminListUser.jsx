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
  Upload,
  Switch,
  DatePicker,
  InputNumber,
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
import { useFormik } from 'formik';
import moment from "moment";

export default function AdminListUser() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { Header, Sider, Content } = Layout;
  const [activeContent, setActiveContent] = useState("userTable");
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
    setSelectedUser(user);
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

  let renderEditMovie = (movie) => {
    console.log("🚀 ~ renderEditMovie ~ movie:", movie);
  };

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
    }
  ];

  const formik = useFormik({
    initialValues: {
      tenPhim: '',
      trailer: '',
      moTa: '',
      ngayKhoiChieu: '',
      dangChieu: false,
      sapChieu: false,
      hot: false,
      danhGia: 0,
      hinhAnh: {},
    },
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
      values.maNhom = "GP01";
      let formData = new FormData()
      for (let key in values) {
        if (key !== "hinhAnh") {
          formData.append(key, values[key])
        } else {
          formData.append("File", values.hinhAnh, values.hinhAnh.name)
        }
      }

      adminService.addMovie(formData)
      .then((result) => {
        fetchListMovie()
        message.success(t("Upload successful"))
      }).catch((err) => {
        dispatch(turnOffLoading())
        message.error(t("Upload failed"))
      });
    },
  });

  let handleDateChange = (date) => {
    let ngayKhoiChieu = moment(date).format("DD/MM/YYYY")
    formik.setFieldValue("ngayKhoiChieu", ngayKhoiChieu)
  }

  let handleSwitchChange = (name) => {
    return (checked) => {
      formik.setFieldValue(name, checked);
    };
  };

  let handleFileChange = (e) => {
    let file = e.target.files[0];
    
    // Check if file is of allowed type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (file && allowedTypes.includes(file.type)) {
      formik.setFieldValue("hinhAnh", file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // If file type is not allowed, clear the file input and show an error message
      e.target.value = '';
      setPreviewImage(null);
      formik.setFieldValue("hinhAnh", {});
      message.error(t('Please select a PNG, JPG, or GIF image file.'));
    }
  }

  return (
    <div data-aos="fade-up" data-aos-delay="500" className="pt-20">
      <Layout>
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
            )}
            {activeContent === "movieManagement" && (
              <Table
                className="w-full"
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
                <Form
                  layout="vertical"
                  onFinish={formik.handleSubmit}
                >
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
                      name="ngayKhoiChieu" format={"DD/MM/YYYY"}
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
                      onChange={(value) => formik.setFieldValue('danhGia', value)}
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
      {/* add modal */}
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
      {/* edit modal */}
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
    </div>
  );
}
