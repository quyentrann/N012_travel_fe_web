import axios from "axios";

const basePath = import.meta.env.VITE_API_BASE_URL;

export async function registerUser({
  email,
  password,
  fullName,
  phoneNumber,
  dob,
  address,
  gender,
}) {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }
    console.log("Sending register request:", {
      email,
      password,
      fullName,
      phoneNumber,
      dob,
      address,
      gender,
    });
    const response = await axios.post(`${basePath}/auth/register`, {
      email,
      password,
      fullName,
      phoneNumber,
      dob,
      address,
      gender,
    });
    console.log("Register response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response || error.message);
    throw error.response?.data?.message || error.message;
  }
}

export async function verifyOtp(email, otp) {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }
    if (!otp || otp.trim() === "") {
      throw new Error("OTP cannot be empty");
    }

    console.log("Sending verify OTP request:", { email, otp });
    const response = await axios.post(`${basePath}/otp/verify`, null, {
      params: { email, otp },
    });
    console.log("Verify OTP response:", response.data);
    return { message: response.data };
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

export async function resendOtp(email) {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }

    console.log("Sending resend OTP request:", { email });
    const response = await axios.post(`${basePath}/otp/send`, null, {
      params: { email },
    });
    console.log("Resend OTP response:", response.data);
    return { message: response.data };
  } catch (error) {
    console.error("Resend OTP error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

export async function forgotPassword(email) {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }

    console.log("Sending forgot password request:", { email });
    const response = await axios.post(`${basePath}/auth/forgot-password`, null, {
      params: { email },
    });
    console.log("Forgot password response:", response.data);
    return { message: response.data };
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}

export async function resetPassword(email, newPassword) {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }
    if (!newPassword || newPassword.trim() === "") {
      throw new Error("New password cannot be empty");
    }

    console.log("Sending reset password request:", { email, newPassword });
    const response = await axios.post(`${basePath}/auth/reset-password`, null, {
      params: { email, newPassword },
    });
    console.log("Reset password response:", response.data);
    return { message: response.data };
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
}