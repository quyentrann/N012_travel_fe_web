import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemBagTourBestForYou from "../../components/ItemBagTourBestForYou";
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Input, Button ,Spin} from 'antd';
import { getTours } from '../../apis/tour';
import Header from '../../components/Header';
function CardChatBotPress() {
  const [tours, setTours] = useState([]); // State để lưu danh sách tour
  const [loading, setLoading] = useState(true); // State để xử lý loading
  const [error, setError] = useState(null); // State để xử lý lỗi
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const visibleCount = 6; // Số lượng tour hiển thị

  const userId = 1; // Giả sử bạn lấy userId từ session hoặc từ store

  useEffect(() => {
    // Fetch all tours when component mounts
    async function fetchTours() {
      try {
        const data = await getTours();
        setTours(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tour:', error);
        setTours([]);
      }
    }

    fetchTours();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm!');
      return;
    }

    try {
      // Gửi userId để lấy gợi ý tour cho người dùng
      const response = await axios.get(`/api/recommendations/${userId}`);
      setTours(response.data); // Cập nhật lại danh sách tour với kết quả gợi ý từ API
    } catch (error) {
      console.error('Lỗi khi tìm kiếm tour:', error);
      setTours([]); // Reset nếu có lỗi
    }
  };


  useEffect(() => {
    // Lấy query params từ URL
    const queryParams = new URLSearchParams(window.location.search);
    const apiUrl = queryParams.get("apiUrl"); // Lấy URL API từ query params
    const categoryId = queryParams.get("categoryId");

    console.log("categoryId từ URL:", categoryId); // Kiểm tra giá trị của categoryId

    if (apiUrl) {
      // Nếu có apiUrl, thực hiện gọi API
      const decodedApiUrl = decodeURIComponent(apiUrl); // Giải mã URL API
      console.log("Gọi API với URL:", decodedApiUrl);

      // Xác định tên danh mục dựa trên ID (có thể tùy chỉnh theo nhu cầu)
      let category = "";
      switch (categoryId) {
        case "1":
          category = "Biển Đảo";
          break;
        case "2":
          category = "Núi Rừng";
          break;
        case "3":
          category = "Thành Phố";
          break;
        case "4":
          category = "Sông Nước Miệt Vườn";
          break;
        case "5":
          category = "Sinh Thái & Khám Phá";
          break;
        default:
          category = "Danh mục không xác định";
          break;
      }
      setCategoryName(category); // Cập nhật tên danh mục

      // Gọi API
      axios
        .get(decodedApiUrl)
        .then((response) => {
          // Nếu API trả về dữ liệu hợp lệ
          setTours(response.data);
          setLoading(false); // Xử lý loading
        })
        .catch((err) => {
          // Xử lý lỗi khi gọi API
          setError("Không thể lấy dữ liệu tour.");
          setLoading(false); // Xử lý loading
        });
    } else {
      setError("Không tìm thấy URL API trong query params.");
      setLoading(false); // Xử lý loading
    }
  }, []); // Chạy useEffect khi component render

  return (
    <div className="w-screen h-screen justify-center">
     <div className="w-full ">
     <Header/>
     </div>
     
      <div className="flex flex-col items-center gap-6 p-6 pt-30">
      <h2 className="text-2xl font-bold mb-4">
              Danh sách tour du lịch 
            </h2>
        {loading ? (
           <Spin
           size="large"
           tip="Đang tải gợi ý..."
           style={{ fontSize: '16px' }}
         />
        ) : error ? (
          <p>{error}</p> // Hiển thị thông báo lỗi nếu có
        ) : (
          <>
            {/* Hiển thị tên danh mục */}
          

            {/* Hiển thị các tour */}
            {tours.length > 0 ? (
              tours.map((tour) => (
                <ItemBagTourBestForYou key={tour.id} tour={tour} />
              ))
            ) : (
              <p>Không có tour nào để hiển thị.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CardChatBotPress;
