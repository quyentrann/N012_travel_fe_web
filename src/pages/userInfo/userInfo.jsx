import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UploadOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Input, Radio, Upload, Form, Avatar, message, Spin, Divider } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../images/defaultAvatar.png';
import logo from '../../images/logo.png';
import { fetchUserProfile, handleUpdateProfile, handleAvatarUpload } from '../../apis/userApi';

const Profile = () => {
  const [form] = Form.useForm();
  const [avatarText, setAvatarText] = useState('U');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getFirstChar = (fullName) => {
    if (!fullName) return 'U';
    const normalized = fullName.normalize('NFC');
    return normalized[0]?.toUpperCase() || 'U';
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const user = await fetchUserProfile(navigate, dispatch);
        if (user) {
          setUserData(user);
          console.log('User data loaded:', user); // Debug
          if (user?.customer) {
            form.setFieldsValue({
              fullName: user.customer.fullName || '',
              email: user.email || '',
              phoneNumber: user.customer.phoneNumber || '',
              address: user.customer.address || '',
              dob: user.customer.dob || '',
              gender: user.customer.gender ? 'female' : 'male',
            });
            if (user.customer.fullName) {
              setAvatarText(getFirstChar(user.customer.fullName));
            }
            if (user.customer.avatarUrl) {
              setAvatarUrl(user.customer.avatarUrl);
            }
          }
        }
      } catch (error) {
        message.error('Lỗi tải hồ sơ: ' + (error.response?.data?.message || error.message));
      }
      setLoading(false);
    };
    loadProfile();
  }, [form, navigate, dispatch]);

  const onUpdateProfile = async (values) => {
    setLoading(true);
    const token = localStorage.getItem('TOKEN');

    const payload = {
      fullName: values.fullName || '',
      email: values.email || userData?.email || '',
      phoneNumber: values.phoneNumber || '',
      address: values.address || '',
      dob: values.dob || '',
      gender: values.gender === 'female', // Chuyển thành boolean
    };

    try {
      console.log('Payload sent to API:', payload); // Debug
      const success = await handleUpdateProfile(payload, token);
      if (success) {
        // Làm mới dữ liệu người dùng
        const updatedUser = await fetchUserProfile(navigate, dispatch);
        if (updatedUser) {
          setUserData(updatedUser);
          form.setFieldsValue({
            fullName: updatedUser.customer?.fullName || '',
            email: updatedUser.email || '',
            phoneNumber: updatedUser.customer?.phoneNumber || '',
            address: updatedUser.customer?.address || '',
            dob: updatedUser.customer?.dob || '',
            gender: updatedUser.customer?.gender ? 'female' : 'male',
          });
          if (updatedUser.customer?.fullName) {
            setAvatarText(getFirstChar(updatedUser.customer.fullName));
          }
          if (updatedUser.customer?.avatarUrl) {
            setAvatarUrl(updatedUser.customer.avatarUrl);
          }
          message.success('Cập nhật hồ sơ thành công!');
        }
        setEditMode(false);
      }
    } catch (error) {
      message.error('Cập nhật hồ sơ thất bại: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const onAvatarUpload = async ({ file }) => {
    setUploading(true);
    const token = localStorage.getItem('TOKEN');
    try {
      const newAvatarUrl = await handleAvatarUpload(file, token, dispatch, navigate);
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
        message.success('Tải ảnh đại diện thành công!');
      }
    } catch (error) {
      message.error('Tải ảnh thất bại: ' + (error.response?.data?.message || error.message));
    }
    setUploading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    message.success('Đăng xuất thành công!');
    navigate('/login');
  };

  const handleAvatarError = () => {
    console.error('Lỗi tải ảnh từ avatarUrl:', avatarUrl);
    setAvatarUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-screen">
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
            <Button type="text" onClick={() => navigate('/')} className="text-gray-600 hover:text-blue-600 text-sm">
              Trang chủ
            </Button>
            <Button
              type="text"
              onClick={() => navigate('/orders')}
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              Đơn mua
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 text-sm"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex-grow flex items-center justify-center p-4 sm:p-8 bg-[#fefcf8f4]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl w-full bg-[#fffcfa] rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" tip="Đang tải thông tin..." />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-6 mb-6"
              >
                <Avatar
                  src={avatarUrl ? <img src={avatarUrl} onError={handleAvatarError} alt="Avatar" /> : defaultAvatar}
                  size={100}
                  className="ring-4 ring-blue-100 shadow-md transition-transform hover:scale-105"
                  icon={!avatarUrl && !avatarText ? <UserOutlined /> : null}
                >
                  {!avatarUrl && avatarText}
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 pl-3">
                    {userData?.customer?.fullName || 'Khách hàng'}
                  </h1>
                  <p className="text-sm text-gray-500 pl-5 pt-1">{userData?.email || 'N/A'}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex space-x-4 mb-6"
              >
                <Upload customRequest={onAvatarUpload} showUploadList={false} accept="image/*" disabled={uploading}>
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    className="bg-blue-600 text-white border-none rounded-lg mr-2 py-2 text-sm hover:bg-blue-700 transition-all"
                  >
                    {uploading ? 'Đang tải...' : 'Thay ảnh đại diện'}
                  </Button>
                </Upload>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                  className="bg-transparent text-blue-600 border border-blue-600 rounded-lg px-4 py-2 text-sm hover:bg-blue-600 hover:text-white transition-all"
                >
                  {editMode ? 'Xem thông tin' : 'Chỉnh sửa'}
                </Button>
              </motion.div>

              <Divider className="my-6" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {editMode ? (
                  <Form form={form} layout="vertical" onFinish={onUpdateProfile} className="space-y-4">
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
                        />
                      </Form.Item>
                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Số điện thoại</span>}
                        name="phoneNumber"
                        rules={[
                          {
                            pattern: /^[0-9]{10,11}$/,
                            message: 'Số điện thoại phải có 10-11 chữ số!',
                            validateTrigger: 'onSubmit',
                          },
                        ]}
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
                        rules={[
                          {
                            validator: (_, value) =>
                              !value || new Date(value) <= new Date()
                                ? Promise.resolve()
                                : Promise.reject('Ngày sinh không hợp lệ!'),
                            validateTrigger: 'onSubmit',
                          },
                        ]}
                      >
                        <Input
                          type="date"
                          className="rounded-lg py-2 px-3 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </Form.Item>
                      <Form.Item
                        label={<span className="text-gray-700 text-sm font-medium">Giới tính</span>}
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                      >
                        <Radio.Group className="flex space-x-4">
                          <Radio value="male" className="text-gray-600 text-sm">
                            Nam
                          </Radio>
                          <Radio value="female" className="text-gray-600 text-sm">
                            Nữ
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-1/2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 border-none text-white text-sm font-medium"
                      >
                        Lưu
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        className="w-1/2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border-none text-gray-700 text-sm font-medium"
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
                        {userData?.customer?.gender ? 'Nữ' : 'Nam'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <Divider className="my-6" />
                <div className="rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Thông Tin Bổ Sung</h3>
                  <p className="text-sm text-gray-600">
                    Thành viên từ:{' '}
                    <span className="text-gray-900">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Cấp độ: <span className="text-blue-600 font-medium">Thành viên Vàng</span>
                  </p>
                  <Button
                    type="link"
                    onClick={() => navigate('/settings')}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Quản lý cài đặt tài khoản
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

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
              <a href="/about" className="hover:text-blue-600">
                Giới thiệu
              </a>{' '}
              |{' '}
              <a href="/contact" className="hover:text-blue-600">
                Liên hệ
              </a>
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