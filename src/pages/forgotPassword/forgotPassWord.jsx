import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import nen from '../../images/nen.png';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import gg from '../../images/Google.png';
import fb from '../../images/fb.png';
import ap from '../../images/apple.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';
import { forgotPassword, verifyOtp, resetPassword } from '../../apis/user';

const sentences = [
  "Forgot your password? Enter your email to receive an OTP and regain access instantly!",
  "Easily recover your account and continue your travel journey!",
  "Just a few steps to reset your password and explore the world with us.",
  "Your account is safe – recover your password and get started now!",
];


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [sendingOtp, setSendingOtp] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      message.warning('Vui lòng nhập email!');
      return;
    }
    setSendingOtp(true);
    try {
      await forgotPassword(email);
      message.success('OTP đã được gửi đến email của bạn!');
      setStep(2);
    } catch (err) {
      message.error(
        err || 'Không thể gửi OTP. Vui lòng kiểm tra email và thử lại!'
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      message.error('Vui lòng nhập mã OTP!');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      message.success('Xác minh OTP thành công!');
      setOtp('');
      setStep(3);
    } catch (err) {
      message.error(err || 'Mã OTP không hợp lệ. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      message.warning('Vui lòng nhập email!');
      return;
    }
    setResendLoading(true);
    try {
      await forgotPassword(email);
      message.success('OTP đã được gửi lại đến email của bạn!');
    } catch (err) {
      message.error(
        err || 'Không thể gửi lại OTP. Vui lòng kiểm tra email và thử lại!'
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email, newPassword);
      message.success('Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.');
      setNewPassword('');
      setConfirmPassword('');
      setStep(1);
      navigate('/login');
    } catch (err) {
      message.error(err || 'Lỗi khi cập nhật mật khẩu. Vui lòng thử lại!');
    } finally {
      setResetLoading(false);
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
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
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
      boxShadow:
        '0px 4pxTài khoản của bạn an toàn – lấy lại mật khẩu và bắt đầu ngay bây giờ!',
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
     className="relative h-screen w-screen flex flex-col lg:flex-row bg-gradient-to-b from-[#009EE2]/10 to-transparent"
     style={{
       backgroundImage: `url(${nen})`,
       backgroundSize: '810px 680px', // Tương ứng với bg-[length:800px_650px]
       backgroundRepeat: 'no-repeat', // Nếu không muốn lặp lại
     }}
   >
      <div className="absolute inset-0 bg-white/50 lg:hidden"></div>
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center px-5 pt-10 relative">
        <img src={logo} alt="Travel" className="h-11 object-contain" />
        <span className="text-3xl font-bold italic font-serif text-black">
          Travel TADA
        </span>
      </div>

      {/* Left Section */}
      <div
        variants={leftSectionVariants}
        initial="initial"
        animate="animate"
        className="hidden lg:flex w-full lg:w-1/2 h-[40vh] lg:h-full flex-col pt-15 lg:pt-12 px-5 lg:px-0">
        <div className="flex items-center gap-x-1 lg:ml-10 px-3 py-1">
          <img
            src={logo}
            alt="Travel"
            className="h-10 lg:h-13 object-contain"
          />
          <span className="text-3xl lg:text-5xl font-extrabold italic font-serif pt-1 lg:pt-2 text-black">
            Travel TADA
          </span>
        </div>
        <motion.p
          key={index}
          variants={leftChildVariants1}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mt-1 lg:mt-1 ml-7 lg:ml-25 mr-4 lg:mr-5 text-base lg:text-[20px] text-black font-normal">
          {sentences[index]}
        </motion.p>
      </div>

      {/* Right Section */}
      <motion.div
        className="w-full m-2 lg:w-1/2 py-15 mt-5 lg:mt-0 lg:h-screen flex flex-col pt-3 lg:pt-4 bg-white/50 lg:bg-white lg:[clip-path:ellipse(120%_80%_at_102%_50%)] [clip-path:polygon(20%_0%,_80%_0%,_100%_10%,_110%_90%,_100%_100%,_20%_100%,_0%_90%,_0%_10%)]"
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
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-[90%] lg:max-w-md px-4"
              style={{ width: '100%', maxWidth: 330 }}>
              <motion.div
                variants={fieldVariants}
                className="text-4xl lg:text-[56px] font-bold text-[#009EE2] text-center pb-1">
                Welcome
              </motion.div>
              <motion.p
                variants={fieldVariants}
                className="text-gray-500 mb-3 lg:mb-3 text-sm lg:text-[18px] text-center">
                Forgot Password
              </motion.p>

              {step === 1 && (
                <>
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
                  <motion.div
                    variants={fieldVariants}
                    className="mt-5 lg:mt-5 ">
                    <motion.div whileTap="tap" variants={buttonVariants}>
                      <Button
                        type="primary"
                        className="w-full !h-10  lg:h-11 !text-[16px] font-medium rounded-lg bg-[#009EE2]"
                        onClick={handleSendOtp}
                        loading={sendingOtp}>
                        Send
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}
              {step === 2 && (
                <>
                  <motion.div variants={fieldVariants} className="mt-3">
                    <Input.OTP
                      length={6}
                      value={otp}
                      onChange={setOtp}
                      autoFocus
                      inputType="numeric"
                      className="w-full h-11 lg:h-11 border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm lg:text-base"
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants} className="mt-3 lg:mt-5">
                    <motion.div whileTap="tap" variants={buttonVariants}>
                      <Button
                        type="primary"
                        className="w-full h-11 lg:h-11 text-base font-medium rounded-lg bg-[#009EE2]"
                        onClick={handleVerifyOtp}
                        loading={loading}>
                        Verify OTP
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    variants={fieldVariants}
                    className="text-right text-xs lg:text-sm text-blue-500 pt-2 pb-3 lg:pb-3">
                    <span
                      className="text-[#009EE2] inline cursor-pointer font-medium hover:underline"
                      onClick={handleResendOtp}>
                      Resend OTP
                    </span>
                  </motion.div>
                </>
              )}
              {step === 3 && (
                <>
                  <motion.div variants={fieldVariants} className="mt-3">
                    <Input.Password
                      size="large"
                      placeholder="Enter new password"
                      prefix={<LockOutlined className="text-gray-500 pr-2" />}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      className="w-full h-11 lg:h-11 border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm lg:text-base"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants} className="mt-3 lg:mt-5">
                    <Input.Password
                      size="large"
                      placeholder="Confirm new password"
                      prefix={<LockOutlined className="text-gray-500 pr-2" />}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      className="w-full h-11 lg:h-11 border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm lg:text-base"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants} className="mt-3 lg:mt-5">
                    <motion.div whileTap="tap" variants={buttonVariants}>
                      <Button
                        type="primary"
                        className="w-full h-11 lg:h-11 text-base font-medium rounded-lg bg-[#009EE2]"
                        onClick={handleResetPassword}
                        loading={resetLoading}>
                        Reset Password
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}

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
                className="mt-3 lg:mt-4 text-gray-700 pt-3 lg:pt-3 text-center text-[16px] lg:text-base">
                Back to{' '}
                <span
                  className="cursor-pointer inline text-[#0d83b5] transition duration-200 hover:underline font-medium"
                  onClick={() => navigate('/login')}>
                  Login
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
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
              className="h-16 lg:h-[140px] pl-6 lg:pl-[30px] lg:pb-[40px] rotate-8"
            />
          </motion.div>
          <motion.div
            className="h-16 lg:h-[110px] justify-end flex flex-1 pr-6 lg:pr-5"
            variants={decorationVariants}
            whileHover="hover">
            <img src={vt2} alt="vt2" className="h-12 lg:h-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
