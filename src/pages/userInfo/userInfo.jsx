import { useEffect, useState } from 'react';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  UploadOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Input, Radio, Upload, Form, Avatar, message, Spin, Divider } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../images/defaultAvatar.png'; // Local default avatar
import logo from '../../images/logo.png'; // From Home page context

const Profile = () => {
  const [form] = Form.useForm();
  const [avatarText, setAvatarText] = useState('U');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('TOKEN');
        if (!token) {
          message.error('Vui lòng đăng nhập lại!');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setUserData(user);

        if (user?.customer) {
          form.setFieldsValue({
            fullName: user.customer.fullName || '',
            email: user.email || '',
            phoneNumber: user.customer.phoneNumber || '',
            address: user.customer.address || '',
            dob: user.customer.dob || '',
            gender: user.customer.gender ? 'male' : user.customer.gender === false ? 'female' : 'other',
          });

          if (user.customer.fullName) {
            setAvatarText(user.customer.fullName[0].toUpperCase());
          }
          if (user.customer.avatar) {
            setAvatarUrl(user.customer.avatar);
          }
        }
      } catch (error) {
        message.error('Không thể tải thông tin hồ sơ!');
        console.error('Lỗi lấy hồ sơ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [form, navigate]);

  // Handle profile update
  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) {
        message.error('Vui lòng đăng nhập lại!');
        return;
      }

      await axios.put('http://localhost:8080/api/users/update-profile', values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Cập nhật hồ sơ thành công!');
      setEditMode(false);

      // Update local userData
      setUserData((prev) => ({
        ...prev,
        customer: { ...prev.customer, ...values },
        email: values.email || prev.email,
      }));
    } catch (error) {
      message.error('Cập nhật thất bại, vui lòng thử lại!');
      console.error('Lỗi cập nhật hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async ({ file }) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post('http://localhost:8080/api/users/upload-avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAvatarUrl(response.data.avatarUrl);
      message.success('Tải ảnh đại diện thành công!');
    } catch (error) {
      message.error('Tải ảnh thất bại, vui lòng thử lại!');
      console.error('Lỗi tải ảnh:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    message.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#e5e1d3] shadow-md py-4 px-4 sm:px-6 sticky top-0 z-20"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Travel TADA" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Dancing Script, cursive' }}>
              Travel TADA
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-blue-600 text-sm"
              aria-label="Quay về trang chủ"
            >
              Trang chủ
            </Button>
            <Button
              type="text"
              onClick={() => navigate('/orders')}
              className="text-gray-600 hover:text-blue-600 text-sm"
              aria-label="Đơn mua"
            >
              Đơn mua
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 text-sm"
              aria-label="Đăng xuất"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-gray-100 to-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl w-full bg-[#fffcfa]  rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" tip="Đang tải thông tin..." />
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-6 mb-6 "
              >
                <Avatar
                  src={avatarUrl || defaultAvatar}
                  size={100}
                  className="ring-4 ring-blue-100 shadow-md transition-transform hover:scale-105"
                  icon={!avatarUrl && !avatarText ? <UserOutlined /> : null}
                >
                  {!avatarUrl && avatarText}
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData?.customer?.fullName || 'Khách hàng'}
                  </h1>
                  <p className="text-sm text-gray-500">{userData?.email || 'N/A'}</p>
                </div>
              </motion.div>

              {/* Profile Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex space-x-4 mb-6"
              >
                <Upload
                  customRequest={handleAvatarUpload}
                  showUploadList={false}
                  accept="image/*"
                  disabled={uploading}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    className="bg-blue-600 text-white border-none rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-all"
                    aria-label="Tải ảnh đại diện"
                  >
                    {uploading ? 'Đang tải...' : 'Thay ảnh đại diện'}
                  </Button>
                </Upload>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                  className="bg-transparent text-blue-600 border border-blue-600 rounded-lg px-4 py-2 text-sm hover:bg-blue-600 hover:text-white transition-all"
                  aria-label={editMode ? 'Xem thông tin' : 'Chỉnh sửa hồ sơ'}
                >
                  {editMode ? 'Xem thông tin' : 'Chỉnh sửa'}
                </Button>
              </motion.div>

              <Divider className="my-6" />

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {editMode ? (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Họ và Tên</span>}
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-gray-400 text-sm" />}
                          placeholder="Họ và tên"
                          className="rounded-lg py-2 px-3 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-required="true"
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Email</span>}
                        name="email"
                      >
                        <Input
                          prefix={<MailOutlined className="text-gray-400 text-sm" />}
                          disabled
                          className="rounded-lg py-2 px-3 bg-gray-100 border-gray-300"
                          aria-disabled="true"
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Số điện thoại</span>}
                        name="phoneNumber"
                      >
                        <Input
                          prefix={<PhoneOutlined className="text-gray-400 text-sm" />}
                          placeholder="Số điện thoại"
                          className="rounded-lg py-2 px-3 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Địa chỉ</span>}
                        name="address"
                      >
                        <Input
                          prefix={<HomeOutlined className="text-gray-400 text-sm" />}
                          placeholder="Địa chỉ"
                          className="rounded-lg py-2 px-3 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Ngày sinh</span>}
                        name="dob"
                      >
                        <Input
                          type="date"
                          className="rounded-lg py-2 px-3 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Ngày sinh"
                        />
                      </Form.Item>

                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Giới tính</span>}
                        name="gender"
                      >
                        <Radio.Group className="flex space-x-4">
                          <Radio value="male" className="text-gray-600 text-sm">Nam</Radio>
                          <Radio value="female" className="text-gray-600 text-sm">Nữ</Radio>
                          <Radio value="other" className="text-gray-600 text-sm">Khác</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-1/2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 border-none text-white text-sm font-medium"
                        aria-label="Lưu thay đổi"
                      >
                        Lưu
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        className="w-1/2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border-none text-gray-700 text-sm font-medium"
                        aria-label="Hủy chỉnh sửa"
                      >
                        Hủy
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Họ và Tên</p>
                      <p className="text-gray-900 font-medium">{userData?.customer?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{userData?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="text-gray-900 font-medium">{userData?.customer?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="text-gray-900 font-medium">{userData?.customer?.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="text-gray-900 font-medium">{userData?.customer?.dob || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="text-gray-900 font-medium">
                        {userData?.customer?.gender === 'male'
                          ? 'Nam'
                          : userData?.customer?.gender === 'female'
                          ? 'Nữ'
                          : 'Khác'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <Divider className="my-6" />
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Thông Tin Bổ Sung</h3>
                  <p className="text-sm text-gray-600">
                    Thành viên từ: <span className="text-gray-900">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Cấp độ: <span className="text-blue-600 font-medium">Thành viên Vàng</span>
                  </p>
                  <Button
                    type="link"
                    onClick={() => navigate('/settings')}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                    aria-label="Chỉnh sửa cài đặt"
                  >
                    Quản lý cài đặt tài khoản
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-[#e5e1d3] py-6 px-4 sm:px-6 shadow-inner"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Về Travel TADA</h4>
            <p>Khám phá thế giới với những hành trình đáng nhớ.</p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Liên kết</h4>
            <p>
              <a href="/about" className="hover:text-blue-600">Giới thiệu</a> |{' '}
              <a href="/contact" className="hover:text-blue-600">Liên hệ</a>
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Hỗ trợ</h4>
            <p>Email: support@traveltada.vn</p>
            <p>Hotline: 1900 8888</p>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          © 2025 Travel TADA. Mọi quyền được bảo lưu.
        </div>
      </motion.footer>
    </div>
  );
};

export default Profile;