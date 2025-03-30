import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { registerUser, verifyOtp,resendOtp } from '../../apis/user';

import nen from '../../images/nen.webp';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';

export default function Register() {
  const [step, setStep] = useState('register'); // "register" | "verifyOtp"
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    if (!form.agree) {
      message.error('You must agree to the terms');
      return;
    }

    setLoading(true);
    try {
      await registerUser(form.email, form.password);
      message.success('OTP has been sent to your email!');
      setStep('verifyOtp'); // Chuyển qua bước nhập OTP
    } catch (error) {
      console.error('Error Response:', error.response);
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      message.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(form.email, otp);
      message.success('Account verified successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('OTP Verification Error:', error.response);
      message.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await resendOtp(form.email);
      message.success('OTP has been resent to your email!');
    } catch (error) {
      console.error('Resend OTP Error:', error.response);
      message.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen w-full flex overflow-hidden"
      style={{ backgroundImage: `url(${nen})` }}>
      {/* Left Section */}
      <div className="w-1/2 min-h-full flex flex-col pt-6">
        <img src={logo} alt="Travel" className="w-1/4 object-contain h-17" />
        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2"
          style={{ color: 'black', fontSize: '55px' }}>
          Travelista Tours
        </h1>
        <p className="mt-1 ml-25 mr-5 text-[20px] text-black font-normal">
          Every journey begins with a single step – embark on an unforgettable
          adventure with us!
        </p>
      </div>

      {/* Right Section */}
      <div
        className="w-1/2 min-h-screen flex flex-col p-5 bg-white shadow-lg"
        style={{ clipPath: 'ellipse(120% 80% at 100% 50%)' }}>
        <div className="flex justify-end">
          <img src={plan} alt="plan" className="w-1/2 object-contain h-12" />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-[56px] font-bold text-[#009EE2]">Welcome</h1>
          <p className="text-gray-500 mb-3 mt-2 text-[18px]">
            Create an Account
          </p>

          {step === 'register' ? (
            <div className="w-full max-w-md space-y-5" style={{ width: 360 }}>
              <Input
                size="large"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                prefix={<MailOutlined className="text-gray-500" />}
              />
              <Input.Password
                size="large"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gray-500" />}
              />
              <Input.Password
                size="large"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                prefix={<LockOutlined className="text-gray-500" />}
              />
              <Checkbox
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}>
                I agree to the{' '}
                <Link to="/terms" className="text-blue-500">
                  Terms & Conditions
                </Link>
              </Checkbox>
              <Button
                type="primary"
                onClick={handleRegister}
                loading={loading}
                style={{ width: '100%', height: 40 }}>
                Register
              </Button>
              <div className="text-center text-gray-600">
                Already have an account?{' '}
                <Link className="text-[#009EE2] font-medium" to="/login">
                  Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-5" style={{ width: 360 }}>
              <h2 className="text-xl font-semibold text-gray-700">Enter OTP</h2>
              <Input.OTP
                length={6}
                value={otp}
                onChange={setOtp}
                autoFocus
                inputType="numeric"
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
          )}
        </div>

        {/* Bottom Decoration */}
        <div className="flex-1 flex items-end">
          <div>
            <img
              src={vt1}
              alt="vt1"
              className="h-[125px] pl-[30px] pb-[30px] rotate-8"
            />
          </div>
          <div className="h-[90px] justify-end flex flex-1 pr-5">
            <img src={vt2} alt="vt2" />
          </div>
        </div>
      </div>
    </div>
  );
}
