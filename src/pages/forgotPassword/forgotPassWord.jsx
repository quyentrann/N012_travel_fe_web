import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, NumberOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import nen from '../../images/nen.webp';
import logo from '../../images/logo.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';
import plan from '../../images/maybay.png';

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
    if (!email) {
      message.warning('Please enter your email!');
      return;
    }
    setSendingOtp(true);
    e.preventDefault();
    try {
      const res = await handleRequest(
        `http://localhost:8080/api/auth/forgot-password?email=${email}`
      );
      message.success(res.message); // Thông báo thành công
      setStep(2); // Chuyển qua bước nhập OTP
    } catch (err) {
      message.error(err.message); // Thông báo lỗi
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await handleRequest(
        `http://localhost:8080/api/auth/verify-otp?email=${email}&otp=${otp}`
      );
      message.success(res.message); // Thông báo thành công
      setOtp('');
      setStep(3);
    } catch (err) {
      message.error(err.message); // Thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (url, data) => {
    try {
      const res = await axios.post(url, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      return message.warning('Bạn chưa nhập email!');
    }

    setResendLoading(true);
    try {
      const res = await handleRequest(
        `http://localhost:8080/api/auth/forgot-password?email=${email}`
      );
      message.success('Đã gửi lại OTP!');
    } catch (err) {
      message.error(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    setResetLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/reset-password?email=${email}&newPassword=${newPassword}`
      );
      message.success(res.data.message); // Success message
      setNewPassword('');
      setConfirmPassword('');
      setStep(1);
      navigate('/login');
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi đặt lại mật khẩu'); // Error message
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex overflow-hidden"
      style={{
        backgroundImage: `url(${nen})`,
      }}>
      <div className="w-1/2 min-h-full flex flex-col pt-6">
        <img src={logo} alt="Travel" className="w-1/4 object-contain h-17" />

        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2 "
          style={{ color: 'black', fontSize: '55px' }}>
          Travelista Tours
        </h1>
        <p className="mt-1 ml-25 mr-5 text-[20px] text-black font-normal">
          Every journey begins with a single step – embark on an unforgettable
          adventure with us, where breathtaking landscapes, rich cultures, and
          extraordinary experiences await at every turn!
        </p>
      </div>
      <div
        className="w-1/2 min-h-screen flex flex-col pt-4 bg-white "
        style={{ clipPath: 'ellipse(120% 80% at 102% 50%)' }}>
        <div className="flex justify-end">
          <img
            src={plan}
            alt="plan"
            className="w-1/2 object-contain pt-1 h-13"
          />
        </div>
        <div className="justify-center flex flex-col items-center mt-10">
          <h1 className="text-[56px] font-bold text-[#009EE2]">Welcome</h1>
          <p className="text-gray-500 mb-3 text-[18px] mt-3">Forgot Password</p>
          <div className="w-full max-w-md" style={{ width: 320 }}>
            {step === 1 && (
              <>
                <Input
                  size="large"
                  placeholder="Enter your email"
                  prefix={<MailOutlined />}
                  className="mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="primary"
                  onClick={handleSendOtp}
                  loading={sendingOtp}
                  style={{
                    width: '100%',
                    height: 43,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 8,
                    backgroundColor: '#009EE2',
                  }}>
                  Send
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <div
                  className="w-full max-w-md space-y-5"
                  style={{ width: 360 }}>
                  <h2 className="text-xl font-semibold text-gray-700">
                    Enter OTP
                  </h2>
                  <Input
                    size="large"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    prefix={<NumberOutlined />}
                    className="mb-4"
                  />

                  <Button
                    type="primary"
                    onClick={handleVerifyOtp}
                    loading={loading}
                    style={{ width: '100%', height: 40 }}>
                    Verify OTP
                  </Button>
                  <Button
                    type="link"
                    onClick={handleResendOtp}
                    loading={resendLoading}
                    className="text-blue-500">
                    Resend OTP
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <Input.Password
                  size="large"
                  placeholder="Enter new password"
                  prefix={<LockOutlined />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mb-4"
                />
                <Input.Password
                  size="large"
                  placeholder="Confirm new password"
                  prefix={<LockOutlined />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-4"
                />
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleResetPassword}
                  loading={resetLoading}
                  style={{ backgroundColor: '#009EE2' }}>
                  Reset Password
                </Button>
              </>
            )}

            <div className="text-center mt-4">
              <Link style={{ color: '#009EE2', fontSize: 16 }} to="/login">
                Go back to login
              </Link>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, alignItems: 'end', display: 'flex' }}>
          <div>
            <img src={vt1} alt="vt1" style={{ height: 170 }} />
          </div>
          <div style={{ justifyContent: 'end', display: 'flex', flex: 1 }}>
            <img src={vt2} alt="vt2" style={{ height: 170 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
