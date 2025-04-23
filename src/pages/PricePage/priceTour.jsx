import React, { useEffect, useState } from "react";
import axios from "axios";

function CardChatBotPress() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy URL API từ query params
    const queryParams = new URLSearchParams(window.location.search);
    const apiUrl = queryParams.get("apiUrl");

    if (apiUrl) {
      console.log("API URL received:", apiUrl); // Debug log: kiểm tra apiUrl được nhận
      const decodedApiUrl = decodeURIComponent(apiUrl);
      console.log("Decoded API URL:", decodedApiUrl); // Debug log: kiểm tra URL đã giải mã

      // Gọi API
      axios
        .get(decodedApiUrl)
        .then((response) => {
          console.log("API response:", response.data); // Debug log: xem dữ liệu trả về
          setTours(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API Error:", err); // Debug log lỗi khi gọi API
          setError("Không thể lấy dữ liệu tour.");
          setLoading(false);
        });
    } else {
      setError("Không có URL API.");
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p>{error}</p>}
      {tours.length > 0 && (
        <div>
          <h2>Danh sách tour</h2>
          {tours.map((tour) => (
            <div key={tour.tourId}>
              <h3>{tour.name}</h3>
              <p>{tour.price} VND</p>
              <p>{tour.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardChatBotPress;
