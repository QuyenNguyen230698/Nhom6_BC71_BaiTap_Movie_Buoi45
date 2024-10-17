import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { http } from '../../services/config';
import { useDispatch } from 'react-redux';
import { setUserAction } from '../reduxMovie/userSlice';
import { useNavigate } from 'react-router-dom';

const FormLogin = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const onFinish = (values) => {
        console.log('Success:', values);
        http.post("/api/QuanLyNguoiDung/DangNhap",values)
        .then((result) => {
            console.log('result:', result);
            dispatch(setUserAction(result.data.content));
            let dataUser = JSON.stringify(result.data.content);
            localStorage.setItem("DATA_USER", dataUser);

            if (result.data.content.maLoaiNguoiDung == "QuanTri") {
              navigate("/list-user");
            } else {
              navigate("/");
            }
            
            message.success('Login Success');
        }).catch((err) => {
            message.error('Login Failed');
        });
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
   return (
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
        taiKhoan: "admin1123",
        matKhau: "123321",
      }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username-admin1123"
      name="taiKhoan"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password-123321"
      name="matKhau"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
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
   )
}
export default FormLogin;