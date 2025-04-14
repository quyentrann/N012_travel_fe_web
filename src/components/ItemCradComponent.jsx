import React from 'react';
import card from '../images/card.jpg';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function ItemCradComponent({ tour }) {
  const navigate = useNavigate();
  const averageRating = tour.reviews?.length
    ? (
        tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
        tour.reviews.length
      ).toFixed(1)
    : 'Chưa có';

  // Lấy danh sách tất cả các booking (kể cả chưa có review)
  const allBookings = tour.reviews?.map((review) => review.booking) || [];

  // Tổng số chỗ đặt (số người tham gia thực tế)
  const totalSeatsBooked = allBookings.reduce(
    (sum, booking) => sum + (booking?.numberPeople || 0),
    0
  );

  // Số lượt đặt tour (số booking)
  const totalOrders = allBookings.length;
  return (
    <div
      className="bg-[#fffcfa] h-67 w-52 rounded-[8px] cursor-pointer hover:scale-101 p-4 flex flex-col"
      onClick={() => navigate('/tour-detail', { state: { id: tour.tourId } })}>
      <div className="flex justify-center flex-col items-center ">
        <img
          src={tour.imageURL || card}
          alt={tour.name || 'Travel'}
          className="h-33 w-49 rounded-[3px]"
        />
      </div>
      <div className="flex flex-col justify-between pt-1 h-1/2 ">
        <div className="pt-2 px-1">
          <p className="text-[14px] font-medium">{tour.name}</p>
        </div>

        <div className="flex pt-2 px-1 text-[14px] font-bold text-red-600">
          <p>
            {tour.price ? `${tour.price.toLocaleString()}` : 'Giá không có'}
            đ/người
          </p>
        </div>

        <div className="flex items-center justify-between px-1 pt-2 text-[12px] text-gray-600">
          <div className="flex items-center text-yellow-500">
            <StarFilled className="text-gray-300" />
            <span className="text-gray-600 ml-1">{averageRating}</span>
          </div>
          <p>{totalSeatsBooked} lượt đặt</p>
        </div>
      </div>
    </div>
  );
}
