import axios from "axios";
const basePath = import.meta.env.VITE_API_BASE_URL;

export async function getSearchHistory() {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${basePath}/search-history/my-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch search history:', error.message);
    return [];
  }
}

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