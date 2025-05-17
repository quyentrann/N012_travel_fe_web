import axios from "axios";
const basePath = import.meta.env.VITE_API_BASE_URL;

export async function getSearchHistory() {
  try {
    const token = localStorage.getItem('TOKEN');
    console.log('Token:', token);
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${basePath}/search-history/my-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Raw tours from /my-history:', response.data);

    const currentDate = new Date();
    console.log('Current date:', currentDate);

    const filteredTours = response.data.filter((tour) => {
      if (tour.tour?.status !== 'ACTIVE') {
        console.log(`Tour ${tour.tour?.tourId || 'unknown'} filtered out: status=${tour.tour?.status}`);
        return false;
      }

      if (!tour.tour?.tourDetails || tour.tour.tourDetails.length === 0) {
        console.log(`Tour ${tour.tour?.tourId || 'unknown'} filtered out: no tourDetails`);
        return false;
      }

      const hasFutureSchedule = tour.tour.tourDetails.some((detail) => {
        const startDate = new Date(detail.startDate);
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        console.log(`Tour ${tour.tour?.tourId}, startDate: ${startDate}, startDateOnly: ${startDateOnly}, currentDateOnly: ${currentDateOnly}`);
        return startDateOnly >= currentDateOnly;
      });

      if (!hasFutureSchedule) {
        console.log(`Tour ${tour.tour?.tourId || 'unknown'} filtered out: no future schedules`);
      }
      return hasFutureSchedule;
    });

    const uniqueTours = Array.from(
      new Map(filteredTours.map((tour) => [tour.tour?.tourId, tour])).values()
    );
    console.log('Filtered tours:', uniqueTours);
    return uniqueTours;
  } catch (error) {
    console.error('Failed to fetch search history:', error.message, error.response?.status);
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

export async function getFavoriteTours() {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      return [];
    }
    const response = await axios.get(`${basePath}/tour-favourites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Raw favorite tours from /tour-favourites:', response.data);
    const currentDate = new Date();
    const filteredTours = response.data
      .filter((tour) => 
        tour.status === 'ACTIVE' &&
        tour.tourDetails?.some((detail) => new Date(detail.startDate) >= currentDate)
      );
    const uniqueTours = Array.from(
      new Map(filteredTours.map((tour) => [tour.tourId, tour])).values()
    );
    console.log('Filtered favorite tours from /tour-favourites:', uniqueTours);
    return uniqueTours;
  } catch (error) {
    console.error('Failed to fetch favorite tours:', error.message);
    return [];
  }
}

export async function calculateChangeFee(bookingId, changeRequest) {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('Không có token');
    }
    const response = await axios.post(
      `${basePath}/bookings/calculate-change-fee/${bookingId}`,
      changeRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi tính phí đổi:', error);
    throw error.response?.data?.message || 'Có lỗi khi tính phí đổi';
  }
}

export async function changeTour(bookingId, changeRequest) {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('Không có token');
    }
    const response = await axios.put(
      `${basePath}/bookings/change/${bookingId}`,
      changeRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi đổi tour:', error);
    throw error.response?.data?.error || 'Có lỗi khi đổi tour';
  }
}

// src/apis/tour.js
export async function createVNPAYPayment(bookingId, totalPrice, paymentMethod) {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('Không có token');
    }
    const response = await axiosInstance.post(
      `/payment/vnpay-create`,
      {
        bookingId,
        totalPrice,
        paymentMethod,
        returnUrl: `${window.location.origin}/vnpay-callback?bookingId=${bookingId}`,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo thanh toán VNPAY:', error);
    throw error.response?.data?.error || 'Có lỗi khi tạo thanh toán VNPAY';
  }
}