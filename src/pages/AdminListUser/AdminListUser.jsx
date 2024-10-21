import React,{useEffect, useState} from 'react'
import { adminService } from '../../services/movieService';
import {Table, Tag, message, Button, Modal, Form, Input, Select} from 'antd';
import { useDispatch } from 'react-redux';
import { turnOffLoading } from '../reduxMovie/spinnerSlice';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import {useTranslation} from 'react-i18next';
import {http} from '../../services/config';
import 'aos/dist/aos.css';

export default function AdminListUser() {
  let dispatch = useDispatch()
  let navigate = useNavigate()
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

  //#region load data users and admin
  let [listUser, setlistUser] = useState([])
  let fetchListUser = () => {
    adminService
      .getListUser()
      .then((result) => {
      setlistUser(result.data.content)   
      }).catch((err) => {
        dispatch(turnOffLoading())
      });
  }
  useEffect(() => {
    let userData = localStorage.getItem("DATA_USER");
    if (!userData) {
      navigate("/")
    } else {
      fetchListUser()
    };
  }, []);
  //#endregion

//#region delete users and admin in new array
let handleDeleteUser = async (user) => {
  try {
    let result = await adminService.deleteUser(user);
    console.log("🚀 ~ handleDeleteUser ~ result:", result)
    fetchListUser()
    dispatch(turnOffLoading())
    message.success(t("User deleted successfully"));
  } catch (error) {
    dispatch(turnOffLoading())
    console.log("error:", error);
    message.error(t("User deleted failed"));
  }
};
//#endregion
 
//#region render data user and AdminListUser

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
      message.success(t("Add Success"));
      setIsRegisterModalOpen(false);
    })
    .catch((err) => {
      dispatch(turnOffLoading());
      message.error(t("Add Failed Please Check Your Information"));
    });
};

const columns = [
  {
    title: t("Full name"),
    dataIndex: 'hoTen',
    key: 'hoTen',
  },
  {
    title: t("Email"),
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: t("Phone number"),
    dataIndex: 'soDT',
    key: 'soDT',
  },
  {
      title: t("Account"),
      dataIndex: 'taiKhoan',
      key: 'taiKhoan',
    },
    {
      title: t("Password"),
      dataIndex: 'matKhau',
      key: 'matKhau',
    },
    {
      title: t("User type"),
      dataIndex: 'maLoaiNguoiDung',
      key: 'maLoaiNguoiDung',
      render: (dataIndex, dataObject) => {
        if (dataObject.maLoaiNguoiDung === "KhachHang") {
          return <Tag color="blue">{t("Customer")}</Tag>;
        } else {
          return <Tag color="red">{t("Admin")}</Tag>;
        }
      }
    },
    {
      title: t("Action"),
      key: 'action',
      render: (_, dataObject) => {
        return (
          <div>
            <button
              onClick={showRegisterModal}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>
              {t("Add")}
            </button>
            <button
              onClick={() => handleDeleteUser(dataObject.taiKhoan)}
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>
              {t("Delete")}
            </button>
          </div>
        )
      }
    },
];
//#endregion
  return (
    <div data-aos="fade-up" data-aos-delay="500" className='container mx-auto px-4 py-20'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <Table 
          className='w-full' 
          dataSource={listUser} 
          columns={columns} 
          rowKey="taiKhoan"
          pagination={{ 
            pageSize: 10, 
            position: ['bottomCenter'],
            className: 'py-4'
          }}
        />
      </div>
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
    </div>
  )
}
