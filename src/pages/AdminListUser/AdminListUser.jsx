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
  DatePicker,
  Switch,
  Upload,
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
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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
  const [file, setFile] = useState(null);

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
  const onFinishAddMovie = async (values) => {
    try {
      const formData = await new Promise((resolve) => {
        const formData = new FormData();
        
        // Thêm tất cả các trường dữ liệu vào formData
        formData.append('tenPhim', values.tenPhim);
        formData.append('trailer', values.trailer);
        formData.append('moTa', values.moTa);
        formData.append('maNhom', values.maNhom);
        formData.append('ngayKhoiChieu', values.ngayKhoiChieu.format('DD/MM/YYYY'));
        formData.append('sapChieu', values.sapChieu);
        formData.append('dangChieu', values.dangChieu);
        formData.append('hot', values.hot);
        formData.append('danhGia', values.danhGia);
        formData.append('File', file);

        console.log('values', values);
        console.log('file', file);

        // Kiểm tra và in ra nội dung của formData
        console.log('formData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        resolve(formData);
      });

      // Gọi API để thêm phim mới
      const result = await adminService.addMovie(formData);
      console.log("result:", result);
      message.success(t('Movie added successfully'));
      setIsAddMovieModalOpen(false);
      fetchListMovie(); // Cập nhật lại danh sách phim
    } catch (error) {
      console.error('Error adding movie:', error);
      message.error(t('Failed to add movie'));
    }
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
  ];

  const handleFileChange = (event) => {
    console.log("🚀 ~ handleFileChange ~ event:", event.target.files[0]);
    setFile(event.target.files[0]);
  };

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
            <Button onClick={showAddMovieModal}>{t("Add Movie")}</Button>
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
              <div>{t("Upload Movie Content")}</div>
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
      {/* Add Movie Modal */}
      <Modal
        title={t("Add Movie")}
        open={isAddMovieModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="addMovie"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          onFinish={onFinishAddMovie}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            maNhom: "GP01",
            sapChieu: true,
            dangChieu: false,
            hot: true,
            danhGia: 10,
          }}
        >
          <Form.Item
            label={t("Movie Name")}
            name="tenPhim"
            rules={[{ required: true, message: t("Please input the movie name!") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Trailer")}
            name="trailer"
            rules={[{ required: true, message: t("Please input the trailer URL!") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Description")}
            name="moTa"
            rules={[{ required: true, message: t("Please input the description!") }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label={t("Group Code")}
            name="maNhom"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label={t("Release Date")}
            name="ngayKhoiChieu"
            rules={[{ required: true, message: t("Please select the release date!") }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label={t("Coming Soon")} name="sapChieu" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t("Now Showing")} name="dangChieu" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t("Hot")} name="hot" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label={t("Rating")}
            name="danhGia"
            rules={[{ required: true, message: t("Please input the rating!") }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>

          <input onChange={handleFileChange} type="file" class="hidden" />

          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <Button block type="primary" htmlType="submit">
              {t("Add Movie")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
