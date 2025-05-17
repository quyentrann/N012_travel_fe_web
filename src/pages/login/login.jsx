import React, { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginSuccess,
  loginFailure,
  initializeAuth,
} from '../../redux/userSlice';
import { login, LOCAL_STORAGE_USER_INFO } from '../../apis/auth/auth';
import { motion } from 'framer-motion';
import nen from '../../images/nen.png';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import gg from '../../images/Google.png';
import fb from '../../images/fb.png';
import ap from '../../images/apple.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';

const sentences = [
  'Log in to discover hundreds of exciting tours and personalize your journey in your own way.',
  'Create an account today to book tours easily, track your itinerary, and receive exclusive offers.',
  'With just one login, the whole world opens up before you – start your dream journey right now!',
  'Explore amazing destinations, plan your ideal trip with just a few clicks.',
];

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('quyentran3101@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 10000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

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
      console.log('API login nèeee', res.data);
      if (res?.status === 200) {
        const { user } = res.data;
        console.log('Dispatching nèeee', { user });
        dispatch(loginSuccess({ user }));
        message.success('Đăng nhập thành công');
        navigate('/');
      } else {
        dispatch(loginFailure('Email hoặc mật khẩu không đúng'));
        message.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      console.error('Lỗi login nèeee', error);
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

  const leftChildVariants1 = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      filter: 'blur(2px)',
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
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
      boxShadow: '0px 4px 12px rgba(0, 158, 226, 0.3)',
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // Animation variants cho nút mạng xã hội
  const socialButtonVariants = {
    hover: {
      scale: 1.001,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
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
      transition: { duration: 0.5, ease: 'easeOut' },
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
      className="relative h-screen w-screen flex flex-col lg:flex-row bg-[url('src/images/nen.png')] bg-[length:800px_650px] lg:bg-[length:700px_700px] bg-gradient-to-b from-[#009EE2]/10 to-transparent"
      style={{ overflowY: 'hidden' }}>
      <div className="absolute inset-0 bg-white/50 lg:hidden"></div>
      {/* Left Section */}
      <motion.div
        variants={leftSectionVariants}
        initial="initial"
        animate="animate"
        className="hidden lg:flex w-full lg:w-1/2 h-[40vh] lg:h-full flex-col pt-15 lg:pt-12 px-5 lg:px-0">
        <div className="flex items-center gap-x-1 lg:ml-10 px-3 py-1">
          <motion.img
            variants={leftChildVariants}
            src={logo}
            alt="Travel"
            className="h-10 lg:h-13 object-contain"
          />
          <motion.span
            variants={leftChildVariants}
            className="text-3xl lg:text-5xl font-extrabold italic font-serif pt-1 lg:pt-2 text-black">
            Travel TADA
          </motion.span>
        </div>

        <motion.p
          key={index}
          variants={leftChildVariants1}
          initial="hidden"
          animate="visible"
          className="mt-1 lg:mt-1 ml-7 lg:ml-25 mr-4 lg:mr-5 text-base lg:text-[20px] text-black font-normal">
          {sentences[index]}
        </motion.p>
      </motion.div>

      {/* Mobile logo */}
      <div className="flex lg:hidden items-center px-5 pt-10 relative">
        <img src={logo} alt="Travel" className="h-11 object-contain" />
        <span className="text-3xl font-bold italic font-serif text-black">
          Travel TADA
        </span>
      </div>

      {/* Right Section */}
      <motion.div
        className="w-full m-2 lg:w-1/2 py-5 mt-5 lg:mt-0 lg:h-screen flex flex-col pt-3 lg:pt-4 bg-white/50 lg:bg-white lg:[clip-path:ellipse(120%_80%_at_102%_50%)] [clip-path:polygon(20%_0%,_80%_0%,_100%_10%,_110%_90%,_100%_100%,_20%_100%,_0%_90%,_0%_10%)]"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}>
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 },
          }}>
          <motion.img
            src={plan}
            alt="plan"
            className="w-1/2 lg:w-1/2 object-contain pt-2 h-12 lg:h-12"
            variants={decorationVariants}
            whileHover="hover"
          />
        </motion.div>

        <div className="justify-center flex flex-col items-center flex-1">
          <motion.div
            variants={formVariants}
            initial="initial"
            animate="animate"
            className="w-full max-w-[90%] lg:max-w-md px-3  lg:bg-transparent"
            style={{ width: '100%', maxWidth: 330 }}>
            <motion.div
              variants={fieldVariants}
              className="text-4xl lg:text-[56px] font-bold text-[#009EE2] text-center pb-1">
              Welcome
            </motion.div>
            <motion.p
              variants={fieldVariants}
              className="text-gray-500 mb-3 lg:mb-3 text-sm lg:text-[18px] text-center">
              Login with Email
            </motion.p>

            <motion.div variants={fieldVariants} className="mt-3">
              <Input
                size="large"
                placeholder="Enter your email"
                prefix={<MailOutlined className="text-gray-500 pr-2" />}
                className="w-full h-11 lg:h-11 border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm lg:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={fieldVariants} className="mt-3 lg:mt-5">
              <Input.Password
                size="large"
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gray-500 pr-2" />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="w-full h-11 lg:h-11 border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm lg:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="text-right text-[14px] lg:text-sm text-blue-400 pt-2 pb-2 lg:pb-3">
              <span
                className="text-[#009EE2] inline cursor-pointer font-medium hover:underline"
                onClick={() => navigate('/forgot-password')}>
                Forgot your password?
              </span>
            </motion.div>

            <motion.div variants={fieldVariants} className="mt-3">
              <motion.div whileTap="tap" variants={buttonVariants}>
                <Button
                  type="primary"
                  className="w-full !h-10 !text-[16px] font-medium rounded-lg bg-[#009EE2]"
                  onClick={loginUser}
                  loading={loading}>
                  Login
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="my-3 lg:my-4 flex items-center w-full justify-center">
              <span className="text-gray-500 text-xs lg:text-[11px]">OR</span>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="mt-3 flex space-x-4 lg:space-x-6 justify-center">
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={socialButtonVariants}
                className="bg-[#d1e9ef] w-20 lg:w-[105px] h-12 lg:h-[50px] flex justify-center items-center rounded-lg">
                <img src={gg} alt="Google" className="h-5 lg:h-6" />
              </motion.button>
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={socialButtonVariants}
                className="bg-[#d1e9ef] w-20 lg:w-[105px] h-12 lg:h-[50px] flex justify-center items-center rounded-lg">
                <img src={fb} alt="Facebook" className="h-5 lg:h-6" />
              </motion.button>
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={socialButtonVariants}
                className="bg-[#d1e9ef] w-20 lg:w-[105px] h-12 lg:h-[50px] flex justify-center items-center rounded-lg">
                <img src={ap} alt="Apple" className="h-5 lg:h-6" />
              </motion.button>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="mt-3 lg:mt-4 text-gray-700 pt-3 lg:pt-3 text-center text-[15px] lg:text-base">
              Don't have an account?{' '}
              <span
                className="cursor-pointer inline text-[#009EE2] transition duration-200 hover:underline font-medium"
                onClick={() => navigate('/register')}>
                Register Now
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 items-end flex"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.4 },
          }}>
          <motion.div variants={decorationVariants} whileHover="hover">
            <img
              src={vt1}
              alt="vt1"
              className="h-16 lg:h-[120px] pl-6 lg:pl-[30px] lg:pb-[40px] rotate-8"
            />
          </motion.div>
          <motion.div
            className="h-16 lg:h-[100px] justify-end flex flex-1 pr-6 lg:pr-5"
            variants={decorationVariants}
            whileHover="hover">
            <img src={vt2} alt="vt2" className="h-12 lg:h-20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
