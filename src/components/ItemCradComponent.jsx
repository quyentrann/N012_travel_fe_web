import React from "react";
import card from "../images/card.jpg";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

export default function ItemCradComponent({tour}) {
   const navigate = useNavigate();
  const averageRating = tour.reviews?.length
    ? (tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length).toFixed(1)
    : "Chưa có";

  // Lấy danh sách tất cả các booking (kể cả chưa có review)
  const allBookings = tour.reviews?.map(review => review.booking) || [];

  // Tổng số chỗ đặt (số người tham gia thực tế)
  const totalSeatsBooked = allBookings.reduce((sum, booking) => sum + (booking?.numberPeople || 0), 0);

  // Số lượt đặt tour (số booking)
  const totalOrders = allBookings.length;
  return (
    <div className="bg-amber-100 h-55 w-40 rounded-[8px] cursor-pointer hover:scale-101 p-2 " onClick={() => navigate('/tour-detail', { state: { id: tour.tourId } })}>
      <div className="flex justify-center">
          <img
                  src={tour.imageURL || card}
                  alt={tour.name || 'Travel'}
                  className="h-27 w-35 rounded-[3px]"
                />
      </div>

      <div className="pt-2 px-1">
        <p className="text-[12px] font-medium">{tour.name}</p>
      </div>

      <div className="flex pt-1 px-1 text-[14px] font-bold text-red-600">
        <p>{tour.price ? `${tour.price.toLocaleString()}` : 'Giá không có'}đ/người</p>
      </div>

      <div className="flex items-center justify-between px-1 pt-1 text-[12px] text-gray-600">
        <div className="flex items-center text-yellow-500">
          <StarFilled className="text-gray-300" /> 
          <span className="text-gray-600 ml-1">{averageRating}</span>
        </div>
        <p>{totalSeatsBooked} lượt đặt</p>
      </div>
    </div>
  );
}
