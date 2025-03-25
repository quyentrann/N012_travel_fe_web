import axios from "axios";

const basePath = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(fullName, email, password) {
  try {
    const response = await axios.post(`${basePath}/auth/register`, {
      fullName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    throw error;
  }
}
