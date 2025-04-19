import React, { useState } from "react";
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
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, verifyOtp, resendOtp } from "../../apis/user";

// Import hình ảnh
import nen from "../../images/nen.webp";
import logo from "../../images/logo.png";
import plan from "../../images/maybay.png";
import vt1 from "../../images/Vector.png";
import vt2 from "../../images/Group688.png";

export default function Register() {
  const [step, setStep] = useState("register"); // "register" | "verifyOtp"
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      console.log("Form values:", values);
      if (!values.email) {
        message.error("Email is missing in form data");
        setLoading(false);
        return;
      }
      const response = await registerUser({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        dob: values.dob?.format("YYYY-MM-DD"),
        address: values.address,
        gender: values.gender,
      });
      if (response.message.includes("OTP")) {
        message.success("OTP has been sent to your email!");
        setStep("verifyOtp");
      } else if (response.message.includes("Tài khoản đã tồn tại")) {
        message.info("Tài khoản đã tồn tại. Vui lòng đăng nhập.");
      } else {
        message.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      message.error(error.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      message.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const email = form.getFieldValue("email");
      console.log("Verify OTP request:", { email, otp });
      const response = await verifyOtp(email, otp);
      message.success(
        response.message || "Account verified successfully! Redirecting..."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Verify OTP error:", error.response?.data || error.message);
      message.error(error.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const email = form.getFieldValue("email");
      console.log("Resend OTP request:", { email });
      const response = await resendOtp(email);
      message.success(response.message || "OTP has been resent to your email!");
    } catch (error) {
      console.error("Resend OTP error:", error.response?.data || error.message);
      message.error(error.response?.data || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Animation variants cho phần bên phải
  const rightSectionVariants = {
    initial: { opacity: 0, x: 100 }, // Bắt đầu từ bên phải
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } }, // Di chuyển sang trái
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
      boxShadow: "0px 4px 12px rgba(0, 158, 226, 0.3)",
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
    <div
      className="min-h-screen w-screen flex overflow-hidden"
      style={{
        backgroundImage: `url(${nen})`,
        backgroundSize: "700px 700px",
      }}
    >
      {/* Left Section - Không có hiệu ứng */}
      <div className="w-1/2 min-h-full flex flex-col pt-12">
        <img src={logo} alt="Travel" className="w-1/4 object-contain h-13 ml-3" />
        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2"
          style={{ color: "black", fontSize: "55px" }}
        >
          Travelista Tours
        </h1>
        <p className="mt-1 ml-25 mr-5 text-[20px] text-black font-normal">
          Every journey begins with a single step – embark on an unforgettable
          adventure with us!
        </p>
      </div>

      {/* Right Section - Hiệu ứng từ phải sang trái */}
      <motion.div
        variants={rightSectionVariants}
        initial="initial"
        animate="animate"
        className="w-1/2 min-h-screen flex flex-col pt-1 bg-white"
        style={{ clipPath: "ellipse(120% 80% at 102% 50%)" }}
      >
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
        >
          <motion.img
            src={plan}
            alt="plan"
            className="w-1/2 object-contain h-10 pt-2"
            variants={decorationVariants}
            whileHover="hover"
          />
        </motion.div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md"
              style={{ width: 370 }}
            >
              <motion.span
                variants={fieldVariants}
                className="text-[40px] font-bold text-[#009EE2] block text-center"
              >
                Welcome
              </motion.span>
              <motion.p
                variants={fieldVariants}
                className="text-gray-500 mb-2 text-[16px] text-center"
              >
                {step === "register" ? "Create an Account" : "Verify Your Email"}
              </motion.p>

              {step === "register" ? (
                <Form
                  form={form}
                  onFinish={handleRegister}
                  className="w-full max-w-md h-100"
                  layout="vertical"
                  style={{ width: 370 }}
                >
                  <motion.div variants={fieldVariants}>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Invalid email format" },
                      ]}
                    >
                      <Input
                        size="middle"
                        placeholder="Enter your email"
                        prefix={<MailOutlined className="text-gray-500" />}
                        className="rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: "Please enter your password" },
                        {
                          min: 6,
                          message: "Password must be at least 6 characters",
                        },
                      ]}
                    >
                      <Input.Password
                        size="middle"
                        placeholder="Enter your password"
                        prefix={<LockOutlined className="text-gray-500" />}
                        className="rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        size="middle"
                        placeholder="Confirm your password"
                        prefix={<LockOutlined className="text-gray-500" />}
                        className="rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="fullName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your full name",
                            },
                          ]}
                        >
                          <Input
                            size="middle"
                            placeholder="Enter your full name"
                            prefix={<UserOutlined className="text-gray-500" />}
                            className="rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="phoneNumber"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your phone number",
                            },
                            {
                              pattern: /^[0-9]{10}$/,
                              message: "Phone number must be 10 digits",
                            },
                          ]}
                        >
                          <Input
                            size="middle"
                            placeholder="Enter your phone number"
                            prefix={<PhoneOutlined className="text-gray-500" />}
                            className="rounded-lg h-[40px] transition-all duration-200 hover:border-[#009EE2]"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="dob"
                          rules={[
                            {
                              required: true,
                              message: "Please select your date of birth",
                            },
                          ]}
                        >
                          <DatePicker
                            size="middle"
                            format="YYYY-MM-DD"
                            className="w-full rounded-lg transition-all duration-200 hover:border-[#009EE2]"
                            placeholder="Select date of birth"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="gender"
                          rules={[
                            {
                              required: true,
                              message: "Please select your gender",
                            },
                          ]}
                        >
                          <Select
                            size="middle"
                            placeholder="Select gender"
                            className="rounded-lg h-[40px] transition-all duration-200 hover:border-[#009EE2]"
                          >
                            <Select.Option value={true}>Male</Select.Option>
                            <Select.Option value={false}>Female</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Form.Item
                      name="address"
                      rules={[
                        { required: true, message: "Please enter your address" },
                      ]}
                    >
                      <Input
                        size="middle"
                        placeholder="Enter your address"
                        className="rounded-lg h-[38px] transition-all duration-200 hover:border-[#009EE2]"
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Form.Item
                      name="agree"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("You must agree to the terms")
                                ),
                        },
                      ]}
                    >
                      <Checkbox>
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-500 hover:underline">
                          Terms & Conditions
                        </Link>
                      </Checkbox>
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Form.Item>
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          style={{
                            width: "100%",
                            height: 38,
                            background: "#009EE2",
                            borderRadius: 12,
                          }}
                        >
                          Register
                        </Button>
                      </motion.div>
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <div className="text-center text-gray-600">
                      Already have an account?{" "}
                      <Link
                        className="text-[#009EE2] font-medium hover:underline"
                        to="/login"
                        style={{ color: "#009EE2" }}
                      >
                        Login
                      </Link>
                    </div>
                  </motion.div>
                </Form>
              ) : (
                <motion.div
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-md space-y-6"
                  style={{ width: 400 }}
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
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        type="primary"
                        onClick={handleVerifyOtp}
                        loading={loading}
                        className="w-full h-[40px] rounded-[12px]"
                        style={{
                          backgroundColor: "#009EE2",
                          borderColor: "#009EE2",
                          height: "40px",
                          width: "360px",
                        }}
                      >
                        Verify OTP
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <motion.div
                      variants={buttonVariants}
                      className="w-fit"
                    >
                      <Button
                        type="link"
                        onClick={handleResendOtp}
                        loading={resendLoading}
                        className="text-[#009EE2] hover:underline"
                        style={{ color: "#009EE2" }}
                      >
                        Resend OTP
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="flex w-screen"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }}
        >
          <motion.div variants={decorationVariants} whileHover="hover">
            <img src={vt1} alt="vt1" className="rotate-8 w-40" />
          </motion.div>
          <motion.div
            className="h-[80px] flex justify-end ml-100"
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