import React from 'react';
import card from '../images/card.jpg';
import {
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function ItemTourComponent({ tour }) {
  const navigate = useNavigate();
  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Không xác định';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${days} ngày ${days - 1} đêm`;
  };
  return (
    <div
      className="bg-white shadow-lg rounded-lg cursor-pointer border border-gray-300 hover:shadow-2xl transition duration-300 overflow-hidden w-83"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/tour-detail', { state: { id: tour.tourId } })}>
      <div className="relative group">
        <img
          src={tour.imageURL || card}
          alt={tour.name || 'Travel'}
          className="h-44 w-full object-cover rounded-t-lg transition duration-300 relative"
        />
        <span className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 text-xs rounded-md">
          Từ Hà Nội
        </span>
      </div>

      <div className="pt-2 px-5 space-y-2">
        <h3 className="text-base font-bold text-gray-900 leading-6">
          {tour.name || 'Tên Tour'}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {tour.description || 'Mô tả tour'}
        </p>
        <div className="text-gray-700 text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <ClockCircleOutlined className="text-gray-500 text-sm" />
            <span>
              {getDuration(
                tour.tourDetails[0]?.startDate,
                tour.tourDetails[0]?.endDate
              ) || '3 ngày 2 đêm'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-gray-500 text-sm" />
            <span>
              {tour.tourDetails[0]?.startDate
                ? new Date(tour.tourDetails[0]?.startDate).toLocaleDateString(
                    'vi-VN'
                  )
                : '23/03/2025'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <UserOutlined className="text-gray-500 text-sm" />
            <span>
              {tour.availableSlot
                ? `Còn ${tour.availableSlot} chỗ`
                : 'Không xác định'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-2 mt-2 text-sm mb-4">
          <div className="flex items-center space-x-1 text-gray-700">
            <EnvironmentOutlined className="text-xs" />
            <span>{tour.location || 'Đà Nẵng'}</span>
          </div>
          <p className="text-[17px] font-bold text-red-600">
            {tour.price ? `${tour.price.toLocaleString()} đ` : 'Giá không có'}
          </p>
        </div>
      </div>
    </div>
  );
}
