import React,{useEffect, useState} from 'react'
import { adminService } from '../../services/movieService';
import { Table, Tag, message } from 'antd';
import { useDispatch } from 'react-redux';
import { turnOffLoading } from '../reduxMovie/spinnerSlice';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function AdminListUser() {
  let dispatch = useDispatch()
  let navigate = useNavigate()

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
    message.success("User deleted successfully");
  } catch (error) {
    dispatch(turnOffLoading())
    console.log("error:", error);
    message.error("User deleted failed");
  }
};
//#endregion
 
//#region render data user and AdminListUser

const columns = [
  {
    title: 'User name',
    dataIndex: 'hoTen',
    key: 'hoTen',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone number',
    dataIndex: 'soDT',
    key: 'soDT',
  },
  {
      title: 'Account',
      dataIndex: 'taiKhoan',
      key: 'taiKhoan',
    },
    {
      title: 'Password',
      dataIndex: 'matKhau',
      key: 'matKhau',
    },
    {
      title: 'User type',
      dataIndex: 'maLoaiNguoiDung',
      key: 'maLoaiNguoiDung',
      render: (dataIndex, dataObject) => {
        if (dataObject.maLoaiNguoiDung === "KhachHang") {
          return <Tag color="blue">Customer</Tag>;
        } else {
          return <Tag color="red">Amin</Tag>;
        }
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, dataObject) => {
        return (
          <div>
            <button
          onClick={()=>handleDeleteUser(dataObject.taiKhoan)}
           className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded'>
              Delete
          </button>
          </div>
        )
      }
    },
];
//#endregion
  return (
    <div data-aos="fade-up" data-aos-delay="500" className='mx-80 pt-20'>
        <Table dataSource={listUser} columns={columns} rowKey="taiKhoan"/>
        </div>
  )
}
