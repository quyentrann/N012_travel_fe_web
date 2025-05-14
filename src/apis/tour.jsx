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
    console.log('Raw tours from /my-history:', response.data);
    const currentDate = new Date();
    const filteredTours = response.data
      .filter((tour) => 
        tour.status === 'ACTIVE' &&
        tour.availableSlot > 0 &&
        tour.tourDetails?.some((detail) => new Date(detail.startDate) >= currentDate)
      );
    const uniqueTours = Array.from(
      new Map(filteredTours.map((tour) => [tour.tourId, tour])).values()
    );
    console.log('Filtered tours:', uniqueTours);
    return uniqueTours;
  } catch (error) {
    console.error('Failed to fetch search history:', error.message);
    return [];
  }
}

export async function getTours() {
  try {
    const response = await axios.get(`${basePath}/tours`);
    console.log('Raw tours from /tours:', response.data);
    const currentDate = new Date();
    const filteredTours = response.data
      .filter((tour) => 
        tour.status === 'ACTIVE' &&
        tour.availableSlot > 0 &&
        tour.tourDetails?.some((detail) => new Date(detail.startDate) >= currentDate)
      );
    const uniqueTours = Array.from(
      new Map(filteredTours.map((tour) => [tour.tourId, tour])).values()
    );
    console.log('Filtered tours from /tours:', uniqueTours);
    return uniqueTours;
  } catch (error) {
    console.error('Lỗi khi tải danh sách tour:', error.message);
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

export async function saveSearchQuery(query) {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.post(
      `${basePath}/search-history/search?query=${encodeURIComponent(query)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lưu lịch sử tìm kiếm:', error.message);
    throw error;
  }
}