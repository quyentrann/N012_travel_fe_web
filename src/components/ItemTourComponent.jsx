import React from 'react';
import card from '../images/card.jpg';
import { EnvironmentOutlined, UserOutlined, ClockCircleOutlined, StarFilled, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function ItemTourComponent({ tour = {} }) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white shadow rounded-md cursor-pointer w-83 border-1 border-gray-200 hover:border-cyan-800/50 hover:border-1"
      role='button'
      tabIndex={0}
      onClick={() => navigate('/tour-detail')}
    >
      {/* Hình ảnh */}
      <div className="relative">
        <img src={card} alt="Travel" className="h-44 w-full object-cover rounded-t-md" />
        <span className="absolute top-2 left-2 bg-black/40 text-white px-2 py-1 text-xs rounded">Từ Hồ Chí Minh</span>
      </div>

      <div className="px-5 py-4">
        <p className="text-[16px] font-semibold text-gray-900">{tour.name || 'Tên Tour'}</p>
        <p className="text-[14px] text-gray-500 m-1">{tour.description || 'Mô tả tour'}</p>

        <div className="text-gray-600 text-sm space-y-2 mt-2">
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-gray-500" />
            <span>{tour.duration || '3 ngày 2 đêm'}</span>
          </div>
          <div className="flex items-center">
            <UserOutlined className="mr-2 text-gray-500" />
            <span>{tour.availableSlot ? `Còn ${tour.availableSlot} chỗ` : 'Số chỗ không xác định'}</span>
          </div>
          {/* Phương tiện di chuyển */}
          <div className="flex items-center">
            <CarOutlined className="mr-2 text-gray-500" />
            <span>{tour.transportation || 'Phương tiện không xác định'}</span>
          </div>
          {/* Đánh giá sao */}
          <div className="flex items-center">
            <StarFilled className="mr-2 text-yellow-500" />
            <span>{tour.rating ? `${tour.rating} / 5` : 'Chưa có đánh giá'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-gray-700">
            <EnvironmentOutlined className="mr-2" />
            <span>{tour.location || 'Đà Nẵng'}</span>
          </div>
          <p className="text-lg font-bold text-red-600">
            {tour.price ? `${tour.price.toLocaleString()} đ` : 'Giá không có'} đ
          </p>
        </div>
      </div>
    </div>
  );
}
