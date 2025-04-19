import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import nen from '../../images/nen.webp';
import logo from '../../images/logo.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';
import plan from '../../images/maybay.png';
import { forgotPassword, verifyOtp, resetPassword } from '../../apis/user';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [sendingOtp, setSendingOtp] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // For OTP verification loading
  const [resendLoading, setResendLoading] = useState(false); // For Resend OTP loading
  const [resetLoading, setResetLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      message.warning('Vui lòng nhập email!');
      return;
    }
    setSendingOtp(true);
    try {
      const res = await forgotPassword(email);
      message.success('OTP đã được gửi đến email của bạn!');
      setStep(2);
    } catch (err) {
      message.error(err || 'Không thể gửi OTP. Vui lòng kiểm tra email và thử lại!');
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
      const res = await verifyOtp(email, otp);
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
      const res = await forgotPassword(email); // Sử dụng forgotPassword thay vì resendOtp
      message.success('OTP đã được gửi lại đến email của bạn!');
    } catch (err) {
      message.error(err || 'Không thể gửi lại OTP. Vui lòng kiểm tra email và thử lại!');
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
      const res = await resetPassword(email, newPassword);
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

  // Animation variants cho nửa phải
  const rightSectionVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
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
      scale: 1.05,
      boxShadow: '0px 4px 12px rgba(0, 158, 226, 0.3)',
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
    <div
      className="min-h-screen w-screen flex overflow-hidden"
      style={{ backgroundImage: `url(${nen})`, backgroundSize: 'cover' }}
    >
      {/* Left Section (Không thay đổi) */}
      <div className="w-1/2 min-h-full flex flex-col pt-6">
        <img src={logo} alt="Travel" className="w-1/4 object-contain h-17" />
        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2"
          style={{ color: 'black', fontSize: '55px' }}
        >
          Travelista Tours
        </h1>
        <p className="mt-1 ml-25 mr-5 text-[20px] text-black font-normal">
          Every journey begins with a single step – embark on an unforgettable
          adventure with us, where breathtaking landscapes, rich cultures, and
          extraordinary experiences await at every turn!
        </p>
      </div>

      {/* Right Section (Có hiệu ứng) */}
      <motion.div
        variants={rightSectionVariants}
        initial="initial"
        animate="animate"
        className="w-1/2 min-h-screen flex flex-col pt-4 bg-white"
        style={{ clipPath: 'ellipse(120% 80% at 102% 50%)' }}
      >
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
        >
          <motion.img
            src={plan}
            alt="plan"
            className="w-1/2 object-contain pt-1 h-13"
            variants={decorationVariants}
            whileHover="hover"
          />
        </motion.div>

        <div className="justify-center flex flex-col items-center mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md"
              style={{ width: 360 }}
            >
              <motion.h1
                variants={fieldVariants}
                className="text-[40px] font-bold text-[#009EE2] text-center"
              >
                Welcome
              </motion.h1>
              <motion.p
                variants={fieldVariants}
                className="text-gray-500 mb-3 text-[16px] mt-3 text-center"
              >
                Forgot Password
              </motion.p>

              {step === 1 && (
                <>
                  <motion.div variants={fieldVariants}>
                    <Input
                      size="middle"
                      placeholder="Enter your email"
                      prefix={<MailOutlined className="text-gray-500" />}
                      className="mb-4 rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button
                        type="primary"
                        onClick={handleSendOtp}
                        loading={sendingOtp}
                        style={{
                          width: '100%',
                          height: 38,
                          fontSize: 16,
                          fontWeight: 500,
                          borderRadius: 12,
                          backgroundColor: '#009EE2',
                        }}
                      >
                        Send
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}
              {step === 2 && (
                <motion.div
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-md space-y-6"
                  style={{ width: 360 }}
                >
                  <motion.h2
                    variants={fieldVariants}
                    className="text-2xl font-semibold text-gray-700 text-center"
                  >
                    Enter OTP
                  </motion.h2>
                  <motion.p
                    variants={fieldVariants}
                    className="text-gray-500 text-sm text-center"
                  >
                    An OTP has been sent to your email. Please enter it below.
                  </motion.p>
                  <motion.div
                    variants={fieldVariants}
                    className="w-full max-w-md space-y-5 flex justify-center"
                  >
                    <Input.OTP
                      length={6}
                      value={otp}
                      onChange={setOtp}
                      autoFocus
                      inputType="numeric"
                      className="rounded-lg transition-all duration-200 hover:border-[#009EE2]"
                    />
                  </motion.div>
                  <motion.div
                    variants={fieldVariants}
                    className="w-full max-w-md space-y-5 flex justify-center"
                  >
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button
                        type="primary"
                        onClick={handleVerifyOtp}
                        loading={loading}
                        className="w-full h-[40px] rounded-[12px]"
                        style={{
                          backgroundColor: '#009EE2',
                          borderColor: '#009EE2',
                          height: '40px',
                          width: '360px',
                        }}
                      >
                        Verify OTP
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <motion.div variants={buttonVariants}>
                      <Button
                        type="link"
                        onClick={handleResendOtp}
                        loading={resendLoading}
                        className="text-[#009EE2] hover:underline"
                        style={{ color: '#009EE2' }}
                      >
                        Resend OTP
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              {step === 3 && (
                <>
                  <motion.div variants={fieldVariants}>
                    <Input.Password
                      size="middle"
                      placeholder="Enter new password"
                      prefix={<LockOutlined className="text-gray-500" />}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mb-4 rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <Input.Password
                      size="middle"
                      placeholder="Confirm new password"
                      prefix={<LockOutlined className="text-gray-500" />}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mb-4 rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                      <Button
                        type="primary"
                        block
                        size="middle"
                        onClick={handleResetPassword}
                        loading={resetLoading}
                        style={{
                          width: '100%',
                          height: 38,
                          fontSize: 16,
                          fontWeight: 500,
                          borderRadius: 12,
                          backgroundColor: '#009EE2',
                        }}
                      >
                        Reset Password
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}

              <motion.div variants={fieldVariants} className="text-center mt-4">
                <Link
                  style={{ color: '#009EE2', fontSize: 16 }}
                  className="hover:underline"
                  to="/login"
                >
                  Go back to login
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
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
    </div>
  );
}