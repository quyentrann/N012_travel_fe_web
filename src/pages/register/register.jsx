import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { registerUser, verifyOtp, resendOtp } from '../../apis/user';
import { useNavigate } from 'react-router-dom';

// Import hình ảnh
import nen from '../../images/nen.png';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';

const sentences = [
  "Don't have an account? Sign up now to start your journey of discovery!",
  "Join Travel TADA – the starting point for unforgettable adventures.",
  "Create an account easily and enjoy exciting travel deals.",
  "One simple sign-up, and thousands of journeys await you!",
];


export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // "register" | "verifyOtp"
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 10000); // 5 seconds
    return () => clearInterval(interval);
  }, []);
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      if (!values.email) {
        message.error('Email is missing in form data');
        setLoading(false);
        return;
      }
      const response = await registerUser({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        dob: values.dob?.format('YYYY-MM-DD'),
        address: values.address,
        gender: values.gender,
      });
      if (response.message.includes('OTP')) {
        message.success('OTP has been sent to your email!');
        setStep('verifyOtp');
      } else if (response.message.includes('Tài khoản đã tồn tại')) {
        message.info('Tài khoản đã tồn tại. Vui lòng đăng nhập.');
      } else {
        message.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      message.error(error.response?.data || 'Registration failed');
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
      const email = form.getFieldValue('email');
      console.log('Verify OTP request:', { email, otp });
      const response = await verifyOtp(email, otp);
      message.success(
        response.message || 'Account verified successfully! Redirecting...'
      );
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Verify OTP error:', error.response?.data || error.message);
      message.error(error.response?.data || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const email = form.getFieldValue('email');
      console.log('Resend OTP request:', { email });
      const response = await resendOtp(email);
      message.success(response.message || 'OTP has been resent to your email!');
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data || error.message);
      message.error(error.response?.data || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const rightSectionVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.005,
      boxShadow: '0px 4px 12px rgba(0, 158, 226, 0.3)',
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

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
      <div className="hidden lg:flex lg:w-1/2 min-h-full flex-col pt-12">
        <img
          src={logo}
          alt="Travel"
          className="w-1/4 object-contain h-13 ml-3"
        />
        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2"
          style={{ color: 'black', fontSize: '55px' }}>
          Travelista Tours
        </h1>
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
      <div className="absolute inset-0 bg-white/25 lg:hidden"></div>
      {/* Form Section (All Screens) */}
      <motion.div
        variants={rightSectionVariants}
        initial="initial"
        animate="animate"
        className="w-full lg:w-1/2 h-screen flex flex-col justify-center bg-white/45 lg:bg-white 
             p-2 lg:p-1 overflow-hidden
             lg:[clip-path:ellipse(120%_80%_at_102%_50%)]">
        {/* Plan Decoration */}
        <div className="hidden lg:flex justify-end">
          <motion.img
            src={plan}
            alt="plan"
            className="w-2/5 lg:w-1/3 lg:h-25 lg:pt-15 lg:pr-10 pr-7"
            variants={decorationVariants}
            whileHover="hover"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-[320px] lg:max-w-md mx-auto">
            <motion.div
              variants={fieldVariants}
              className="text-4xl lg:text-[40px] font-bold text-[#009EE2] text-center lg:pt-0 pb-1 pt-5">
              Welcome
            </motion.div>
            <motion.p
              variants={fieldVariants}
              className="text-gray-500 text-sm lg:text-[16px] text-center mb-2">
              {step === 'register' ? 'Create an Account' : 'Verify Your Email'}
            </motion.p>

            {step === 'register' ? (
              <Form
                form={form}
                onFinish={handleRegister}
                className="w-full"
                layout="vertical">
                <motion.div variants={fieldVariants} className=" lg:mt-0">
                  <Form.Item
                    name="email"
                    style={{ marginBottom: '18px' }}
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Invalid email format' },
                    ]}>
                    <Input
                      size="large"
                      placeholder="Enter your email"
                      prefix={<MailOutlined className="text-gray-500 pr-2" />}
                      className="w-full h-11 lg:h-[38px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={fieldVariants} className="lg:mt-0">
                  <Form.Item
                    name="password"
                    style={{ marginBottom: '18px' }}
                    rules={[
                      { required: true, message: 'Please enter your password' },
                      {
                        min: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    ]}>
                    <Input.Password
                      size="large"
                      placeholder="Enter your password"
                      prefix={<LockOutlined className="text-gray-500 pr-2" />}
                      className="w-full h-11 lg:h-[38px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={fieldVariants} className="lg:mt-0">
                  <Form.Item
                    name="confirmPassword"
                    style={{ marginBottom: '18px' }}
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Passwords do not match')
                          );
                        },
                      }),
                    ]}>
                    <Input.Password
                      size="large"
                      placeholder="Confirm your password"
                      prefix={<LockOutlined className="text-gray-500 pr-2" />}
                      className="w-full h-11 lg:h-[38px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={fieldVariants} className=" lg:mt-0">
                  <Row gutter={8}>
                    <Col span={24} lg={12}>
                      <Form.Item
                        name="fullName"
                        style={{ marginBottom: '18px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your full name',
                          },
                        ]}>
                        <Input
                          size="large"
                          placeholder="Enter your full name"
                          prefix={
                            <UserOutlined className="text-gray-500 pr-2" />
                          }
                          className="w-full h-11 lg:h-[38px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                      <Form.Item
                        name="phoneNumber"
                        style={{ marginBottom: '18px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your phone number',
                          },
                          {
                            pattern: /^[0-9]{10}$/,
                            message: 'Phone number must be 10 digits',
                          },
                        ]}>
                        <Input
                          size="large"
                          placeholder="Enter your phone number"
                          prefix={
                            <PhoneOutlined className="text-gray-500 pr-2" />
                          }
                          className="w-full h-11 lg:h-[40px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </motion.div>

                <motion.div variants={fieldVariants} className=" lg:mt-0">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="dob"
                        style={{ marginBottom: '18px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Please select your date of birth',
                          },
                        ]}>
                        <DatePicker
                          size="large"
                          format="YYYY-MM-DD"
                          className="w-full h-11 lg:h-[40px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                          placeholder="Select date of birth"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        style={{ marginBottom: '18px' }}
                        rules={[
                          {
                            required: true,
                            message: 'Please select your gender',
                          },
                        ]}>
                        <Select
                          size="large"
                          placeholder="Select gender"
                          className="w-full h-11 lg:h-[40px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm">
                          <Select.Option value={true}>Male</Select.Option>
                          <Select.Option value={false}>Female</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </motion.div>

                <motion.div variants={fieldVariants} className=" lg:mt-0">
                  <Form.Item
                    name="address"
                    style={{ marginBottom: '10px' }}
                    rules={[
                      { required: true, message: 'Please enter your address' },
                    ]}>
                    <Input
                      size="large"
                      placeholder="Enter your address"
                      className="w-full h-11 lg:h-[38px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={fieldVariants} className="lg:mt-0">
                  <Form.Item
                    name="agree"
                    style={{ marginBottom: '10px' }}
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error('You must agree to the terms')
                              ),
                      },
                    ]}>
                    <Checkbox className="text-[16px] lg:text-base">
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        className="text-[#009EE2] hover:underline">
                        Terms & Conditions
                      </Link>
                    </Checkbox>
                  </Form.Item>
                </motion.div>

                <motion.div variants={fieldVariants} className="lg:mt-0">
                  <motion.div whileTap="tap" variants={buttonVariants}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="w-full !h-10 lg:h-[38px] !text-[16px] font-medium rounded-lg bg-[#009EE2]">
                      Register
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fieldVariants}
                  className=" pt-2 pb-5 lg:mt-0 lg:pt-0 text-gray-700 text-center text-[16px] lg:text-base">
                  Already have an account?{' '}
                  <span
                    className="cursor-pointer inline-block text-[#009EE2] transition duration-200 hover:underline font-medium px-3 py-2 relative z-20"
                    onClick={() => {
                      console.log('Login link clicked');
                      navigate('/login');
                    }}
                    onTouchStart={() => {
                      console.log('Login link touched');
                      navigate('/login');
                    }}>
                    Login
                  </span>
                </motion.div>
              </Form>
            ) : (
              <div className="space-y-1 lg:space-y-5">
                <motion.div
                  variants={fieldVariants}
                  className="text-2xl lg:text-2xl font-semibold text-gray-700 text-center">
                  Enter OTP
                </motion.div>
                <motion.div
                  variants={fieldVariants}
                  className="w-full max-w-md flex justify-center">
                  <Input.OTP
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    autoFocus
                    inputType="numeric"
                    className="w-full h-11 lg:h-[40px] border border-[#4A90E2] rounded-lg transition-all duration-200 hover:border-[#009EE2] text-sm"
                  />
                </motion.div>
                <motion.div
                  variants={fieldVariants}
                  className="flex justify-center">
                  <motion.div whileTap="tap" variants={buttonVariants}>
                    <Button
                      type="primary"
                      onClick={handleVerifyOtp}
                      loading={loading}
                      className="w-full h-11 lg:h-[40px] text-base font-medium rounded-lg bg-[#009EE2]"
                      style={{
                        maxWidth: step === 'verifyOtp' ? '360px' : '100%',
                      }}>
                      Verify OTP
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  variants={fieldVariants}
                  className="text-center text-xs lg:text-base text-[#009EE2]">
                  <span
                    className="cursor-pointer inline font-medium hover:underline"
                    onClick={handleResendOtp}>
                    Resend OTP
                  </span>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Decorations (Desktop Only) */}
        <motion.div
          className="hidden lg:flex w-full mt-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.4 },
          }}>
          <motion.div variants={decorationVariants} whileHover="hover">
            <img src={vt1} alt="vt1" className="rotate-8 w-40" />
          </motion.div>
          <motion.div
            className="h-[80px] flex justify-end ml-auto"
            variants={decorationVariants}
            whileHover="hover">
            <img src={vt2} alt="vt2" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
