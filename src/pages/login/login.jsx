import React, { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, initializeAuth } from '../../redux/userSlice';
import { login, LOCAL_STORAGE_USER_INFO } from '../../apis/auth/auth';
import { motion } from 'framer-motion';
import nen from '../../images/nen.webp';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import gg from '../../images/Google.png';
import fb from '../../images/fb.png';
import ap from '../../images/apple.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('quyentran3101@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const loginUser = async () => {
    if (!email || !password) {
      message.error('Vui lòng nhập email và mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      console.log("API login nèeee", res.data);
      if (res?.status === 200) {
        const { user } = res.data;
        console.log("Dispatching nèeee", { user });
        dispatch(loginSuccess({ user }));
        message.success('Đăng nhập thành công');
        navigate('/');
      } else {
        dispatch(loginFailure('Email hoặc mật khẩu không đúng'));
        message.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      console.error("Lỗi login nèeee", error);
      dispatch(loginFailure(error.message));
      message.error('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants cho toàn bộ trang
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  // Animation variants cho phần trái
  const leftSectionVariants = {
    initial: { opacity: 0, x: -50 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  // Animation variants cho các phần tử con bên trái
  const leftChildVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Animation variants cho form và các trường nhập liệu
  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  // Animation variants cho từng trường nhập liệu
  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Animation variants cho nút
  const buttonVariants = {
    hover: {
      scale: 1.005,
      boxShadow: "0px 4px 12px rgba(0, 158, 226, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // Animation variants cho nút mạng xã hội
  const socialButtonVariants = {
    hover: {
      scale: 1.001,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // Animation variants cho hình ảnh trang trí
  const decorationVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
  };

  return (
    <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-screen w-screen flex overflow-hidden"
    style={{
      backgroundImage: `url(${nen})`,
      backgroundSize: '700px 700px',
    }}
  >
      {/* Left Section */}
      <motion.div
        variants={leftSectionVariants}
        initial="initial"
        animate="animate"
        className="w-1/2 min-h-full flex flex-col pt-12"
      >
        <motion.img
          variants={leftChildVariants}
          src={logo}
          alt="Travel"
          className="w-1/4 object-contain h-13 ml-3"
        />
        <motion.h1
          variants={leftChildVariants}
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2"
          style={{ color: "black", fontSize: "55px" }}
        >
          Travelista Tours
        </motion.h1>
        <motion.p
          variants={leftChildVariants}
          className="mt-1 ml-25 mr-5 text-[20px] text-black font-normal"
        >
          Every journey begins with a single step – embark on an unforgettable
          adventure with us, where breathtaking landscapes, rich cultures, and
          extraordinary experiences await at every turn!
        </motion.p>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="w-1/2 min-h-screen flex flex-col pt-4 bg-white"
        style={{ clipPath: "ellipse(120% 80% at 102% 50%)" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
      >
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
        >
          <motion.img
            src={plan}
            alt="plan"
            className="w-1/2 object-contain pt-1 h-12"
            variants={decorationVariants}
            whileHover="hover"
          />
        </motion.div>

        <div className="justify-center flex flex-col items-center">
          <motion.div
            variants={formVariants}
            initial="initial"
            animate="animate"
            className="w-full max-w-md"
            style={{ width: 350 }}
          >
            <motion.div
              variants={fieldVariants}
              className="text-[56px] font-bold text-[#009EE2] text-center"
            >
              Welcome
            </motion.div>
            <motion.p
              variants={fieldVariants}
              className="text-gray-500 mb-3 text-[18px] text-center"
            >
              Login with Email
            </motion.p>

            <motion.div variants={fieldVariants}>
              <Input
                size="large"
                placeholder="Enter your email"
                prefix={<MailOutlined className="text-gray-500 pr-2" />}
                className="w-full h-11 border border-gray-400 rounded-lg transition-all duration-200 hover:border-[#009EE2]"
                style={{ borderColor: '#4A90E2', fontSize: 14 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={fieldVariants} className="mt-5">
              <Input.Password
                size="large"
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gray-500 pr-2" />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="w-full h-11 border border-gray-400 rounded-lg transition-all duration-200 hover:border-[#009EE2]"
                style={{ borderColor: '#4A90E2', fontSize: 14 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div variants={fieldVariants} className="text-right text-sm text-blue-500 pt-1 pb-3">
              <span
                className="text-[#009EE2] inline cursor-pointer font-[500] hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot your password?
              </span>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                <Button
                  type="primary"
                  style={{
                    width: '100%',
                    height: 43,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 8,
                    backgroundColor: '#009EE2',
                  }}
                  onClick={loginUser}
                  loading={loading}
                >
                  Login
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="my-4 flex items-center w-full justify-center"
            >
              <span className="text-gray-500 text-[11px]">OR</span>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="flex space-x-6 justify-center"
            >
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={socialButtonVariants}
                className="bg-[#E7F2F5] w-[95px] h-[45px] flex justify-center items-center rounded-lg"
              >
                <img src={gg} alt="Google" className="h-4" />
              </motion.button>
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={socialButtonVariants}
                className="bg-[#E7F2F5] w-[95px] h-[45px] flex justify-center items-center rounded-lg"
              >
                <img src={fb} alt="Facebook" className="h-5" />
              </motion.button>
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={socialButtonVariants}
                className="bg-[#E7F2F5] w-[95px] h-[45px] flex justify-center items-center rounded-lg"
              >
                <img src={ap} alt="Apple" className="h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="mt-4 text-gray-700 pt-3 text-center"
              style={{ fontSize: 16 }}
            >
              Don't have an account?{' '}
              <span
                className="cursor-pointer inline text-[#009EE2] transition duration-200 hover:underline"
                onClick={() => navigate('/register')}
              >
                Register Now
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 items-end flex"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }}
        >
          <motion.div variants={decorationVariants} whileHover="hover">
            <img
              src={vt1}
              alt="vt1"
              className="h-[140px] pl-[30px] pb-[40px] rotate-8"
            />
          </motion.div>
          <motion.div
            className="h-[110px] justify-end flex flex-1 pr-5"
            variants={decorationVariants}
            whileHover="hover"
          >
            <img src={vt2} alt="vt2" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}