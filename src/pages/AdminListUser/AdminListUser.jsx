import React,{useEffect, useState} from 'react'
import { adminService } from '../../services/movieService';
import { Modal, Table, Tag, message } from 'antd';


export default function AdminListUser() {

  //#region load data users and admin
  let [listUser, setlistUser] = useState([])
  useEffect(() => {
    let userData = localStorage.getItem("DATA_USER");
    if (!userData) {
      window.location.href = "/"
    } else {
      adminService
      .getListUser()
      .then((result) => {
      setlistUser(result.data.content)   
      }).catch((err) => {});
    } 
  }, []);
  //#endregion

//#region delete users and admin in new array
let handleDeleteUser = (user) => {
  console.log('listUser',listUser);
  Modal.confirm({
    title: 'Are you sure you want to delete this user?',
    okText: 'Yes',
    cancelText: 'No',
    onOk: () => {
      let newListUser = listUser.filter((item) => {
        return item.taiKhoan !== user;
      });
      setlistUser(newListUser);
      message.success('User deleted successfully');
      console.log('listUser',listUser);
    },
    onCancel: () => {
      message.info('User deletion canceled');
    },
  });
};
//#endregion
 
//#region render data user and AdminListUser
const columns = [
  {
    title: 'User name',
    dataIndex: 'hoTen',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone number',
    dataIndex: 'soDT',
    key: 'phoneNumber',
  },
  {
      title: 'Account',
      dataIndex: 'taiKhoan',
      key: 'account',
    },
    {
      title: 'Password',
      dataIndex: 'matKhau',
      key: 'password',
    },
    {
      title: 'User type',
      dataIndex: 'maLoaiNguoiDung',
      key: 'userType',
      render: (dataIndex, dataObject) => {
        if (dataObject.maLoaiNguoiDung === "KhachHang") {
          return <Tag color="blue">Khách hàng</Tag>;
        } else {
          return <Tag color="red">Quản trị</Tag>;
        }
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text,user) => (
          <button
          onClick={()=>handleDeleteUser(user.taiKhoan)}
           className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded'>
              Delete
          </button>
      )
    },
];
//#endregion
  return (
    <div className='mx-80 pt-20'>
        <Table dataSource={listUser} columns={columns} rowKey="taiKhoan"/>
        </div>
  )
}
