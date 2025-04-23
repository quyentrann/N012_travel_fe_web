import React, { useEffect, useState } from 'react';
import ItemBagTourBestForYou from '../../components/ItemBagTourBestForYou';
import { getTours } from '../../apis/tour';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BestForYouBagTour() {
   const [tours, setTours] = useState([]);
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

  return (
    <div className="w-screen h-screen ">
      {/* Thanh Điều hướng (Nav) cố định */}
      <nav className="bg-gray-200 text-white py-4 px-7 sticky top-0 z-10">
      <div className="max-w-[1500px] mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-yellow-300">Trang chủ</Link>
            <Link to="/account" className="hover:text-yellow-300">Tài khoản</Link>
            <Link to="/about" className="hover:text-yellow-300">Giới thiệu</Link>
            <Link to="/contact" className="hover:text-yellow-300">Liên hệ</Link>
          </div>

          {/* Thanh Tìm kiếm */}
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Nhập từ khóa tìm kiếm..."
              prefix={<SearchOutlined className="text-gray-400 text-[16px]" />}
              className="h-9 border border-gray-300 focus:ring-blue-500 !text-[14px] rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm
              onPressEnter={handleSearch} // Gọi handleSearch khi nhấn Enter
            />
            <Button onClick={handleSearch} type="primary">Tìm kiếm</Button>
          </div>
        </div>
      </nav>

      {/* Nội dung của tour */}
      <div className="flex justify-center p-14">
        <div className="flex flex-col items-center gap-6 p-6 max-w-[1500px]">
          {tours.slice(0, visibleCount).map((tour) => (
            <ItemBagTourBestForYou key={tour.tourId} tour={tour} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BestForYouBagTour;
