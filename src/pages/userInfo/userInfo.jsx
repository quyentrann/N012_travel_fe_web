import { useEffect, useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Button, Input, Radio, Upload, Form, Avatar, message } from 'antd';
import axios from 'axios';

const Profile = () => {
  const [form] = Form.useForm();
  const [avatarText, setAvatarText] = useState('U');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('TOKEN');
        if (!token) return;

        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        if (userData?.customer) {
          form.setFieldsValue({
            fullName: userData.customer.fullName || '',
            email: userData.email || '',
            phoneNumber: userData.customer.phoneNumber || '',
            address: userData.customer.address || '',
            dob: userData.customer.dob || '',
            gender: userData.customer.gender ? 'male' : 'female',
          });

          if (userData.customer.fullName) {
            setAvatarText(userData.customer.fullName[0].toUpperCase());
          }
        }
      } catch (error) {
        console.error('Lỗi lấy hồ sơ:', error);
      }
    };

    fetchUserProfile();
  }, [form]);

  const handleUpdateProfile = async (values) => {
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) return;

      await axios.put(
        'http://localhost:8080/api/users/update-profile',
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      message.error('Cập nhật thất bại, vui lòng thử lại!');
      console.error('Lỗi cập nhật hồ sơ:', error);
    }
  };

  return (
    <div className="flex justify-between bg-gray-50 h-screen w-screen">
      {/* Bên trái - Nội dung tùy chỉnh */}
      <div className="flex items-center justify-center bg-blue-100 w-1/2 h-full">
        <div className="text-center h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Chào mừng!</h1>
          <p className="mt-2 text-gray-600">
            Cập nhật thông tin của bạn tại đây.
          </p>
        </div>
      </div>

      {/* Bên phải - Hồ sơ người dùng */}
      <div className="bg-white shadow-xl rounded-lg w-2/3 p-8 px-30 h-fit">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-3">
          Hồ Sơ Của Tôi
        </h2>
        <div className="flex justify-between">
          <div className="flex flex-col items-center mb-8 justify-between h-40">
            {/* Avatar */}
            <Avatar size={120} className="bg-blue-500 text-white text-4xl">
              {avatarText}
            </Avatar>
            <Upload showUploadList={false} className="mt-4">
              <Button
                icon={<UploadOutlined />}
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-full py-2 px-6">
                Tải lên ảnh
              </Button>
            </Upload>
          </div>
          <div className='w-full pl-20 h-137'>
            {/* Form chỉnh sửa thông tin */}
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item
                label="Họ và Tên"
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên' },
                ]}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập họ và tên"
                  className="py-2 px-4 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input
                  prefix={<MailOutlined />}
                  disabled
                  className="py-2 px-4 bg-gray-100 rounded-md shadow-sm border-gray-300"
                />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                  className="py-2 px-4 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="Nhập địa chỉ"
                  className="py-2 px-4 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>

              <Form.Item label="Giới tính" name="gender">
                <Radio.Group className="flex gap-6">
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                  <Radio value="other">Khác</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Ngày sinh" name="dob">
                <Input
                  type="date"
                  className="py-2 px-4 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
