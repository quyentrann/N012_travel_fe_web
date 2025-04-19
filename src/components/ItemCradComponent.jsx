import React, { useState } from 'react';
import card from '../images/card.jpg';
import { StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function ItemCradComponent({ tour }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Log dữ liệu tour để debug
  console.log('Tour data:', tour);

  // Tính điểm đánh giá trung bình
  const averageRating = tour.reviews?.length
    ? (
        tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
        tour.reviews.length
      ).toFixed(1)
    : 'Chưa có';

  // Lấy danh sách tất cả các booking (từ reviews hoặc bookings)
  const allBookings = tour.bookings?.length
    ? tour.bookings // Nếu API cung cấp tour.bookings
    : tour.reviews?.map((review) => review.booking).filter(Boolean) || []; // Chỉ lấy booking không null/undefined

  // Log allBookings để kiểm tra
  console.log('All bookings:', allBookings);

  // Tổng số chỗ đặt (số người tham gia thực tế)
  const totalSeatsBooked = allBookings.reduce(
    (sum, booking) => sum + (booking?.numberPeople || 0),
    0
  );

  // Log totalSeatsBooked để kiểm tra
  console.log('Total seats booked:', totalSeatsBooked);

  // Số lượt đặt tour (số booking)
  const totalOrders = allBookings.length;

  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="bg-[#fffcfa] h-67 w-52 rounded-[8px] cursor-pointer hover:scale-101 p-4 flex flex-col relative"
      onClick={() => navigate('/tour-detail', { state: { id: tour.tourId } })}
    >
      <div
        className="absolute top-1 right-1.5 cursor-pointer text-[20px]"
        onClick={handleToggleFavorite}
      >
        {isFavorite ? (
          <HeartFilled style={{ color: '#FF6666', fontSize: '20px' }} />
        ) : (
          <HeartOutlined style={{ color: '#CC6666', fontSize: '20px' }} />
        )}
      </div>

      <div className="flex justify-center flex-col items-center">
        <img
          src={tour.imageURL || card}
          alt={tour.name || 'Travel'}
          className="h-33 w-49 rounded-[3px] m-0.5"
        />
      </div>
      <div className="flex flex-col justify-between pt-1 h-1/2">
        <div className="pt-2 px-1">
          <p className="text-[14px] font-medium">{tour.name}</p>
        </div>

        <div className="flex pt-2 px-1 text-[14px] font-bold text-red-600">
          <p>
            {tour.price ? `${tour.price.toLocaleString()} đ/người` : 'Giá không có'}
          </p>
        </div>

        <div className="flex items-center justify-between px-1 pt-2 text-[12px] text-gray-600">
          <div className="flex items-center text-yellow-500">
            <StarFilled className="text-gray-300" />
            <span className="text-gray-600 ml-1">{averageRating}</span>
          </div>
          <p>{totalSeatsBooked ? `${totalSeatsBooked} lượt đặt` : 'Chưa có lượt đặt'}</p>
        </div>
      </div>
    </div>
  );
}