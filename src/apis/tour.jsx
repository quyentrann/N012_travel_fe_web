import axios from "axios";
const basePath = import.meta.env.VITE_API_BASE_URL;


export async function getTours() {
    try {
      const response = await axios.get(`${basePath}/tours`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải danh sách tour:", error);
      return [];
    }
  }

  export async function getTourById(tourId) {
  try {
    const response = await axios.get(`${basePath}/tours/${tourId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết tour:", error);
    return null;
  }
}