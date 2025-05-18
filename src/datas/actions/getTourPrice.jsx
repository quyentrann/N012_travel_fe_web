const axios = require('axios');

async function getTourInfo(state, event) {
  const tourPriceApi = 'http://18.138.107.49:8080/api/tours'; // URL của API của bạn

  try {
    const response = await axios.get(tourPriceApi);
    const tourData = response.data;

    // Lưu tourData vào state để sử dụng sau
    state.tourInfo = tourData;

    return state;
  } catch (error) {
    console.error('Error fetching tour data', error);
    return state;
  }
}

return getTourInfo;
