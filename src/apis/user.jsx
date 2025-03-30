import axios from "axios";

const basePath = import.meta.env.VITE_API_BASE_URL;

export async function registerUser( email, password) {
  try {
    const response = await axios.post(`${basePath}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    throw error;
  }
}

export async function verifyOtp(email, otp) {
  try {
    const response = await axios.post(`${basePath}/otp/verify`, {}, { // Thay null bằng {}
      params: { email, otp },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xác thực OTP:", error);
    throw error;
  }
}



export async function resendOtp(email) {
  try {
    const response = await axios.post(`${basePath}/otp/send`, null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi lại OTP:", error);
    throw error;
  }
}

