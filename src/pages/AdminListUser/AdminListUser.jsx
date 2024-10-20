import React,{useEffect, useState} from 'react'
import { adminService } from '../../services/movieService';
import { Table, Tag, message } from 'antd';
import { useDispatch } from 'react-redux';
import { turnOffLoading } from '../reduxMovie/spinnerSlice';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import {useTranslation} from 'react-i18next';
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
    <div data-aos="fade-up" data-aos-delay="500" className='container mx-auto px-4 py-8'>
      <h1 className="text-2xl font-bold mb-6">{t("User Management")}</h1>
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
    </div>
  )
}
