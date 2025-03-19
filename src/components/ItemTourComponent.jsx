import React from 'react';
import card from '../images/card.jpg';
import { EnvironmentOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined, StarFilled, CarOutlined, GiftOutlined } from '@ant-design/icons';

export default function ItemTourComponent() {
  return (
    <div className="bg-white shadow rounded-md cursor-pointer w-83 border-1 border-gray-200 hover:border-cyan-800/50 hover:border-1">
      {/* Hình ảnh */}
      <div className="relative">
        <img src={card} alt="Travel" className="h-44 w-full object-cover rounded-t-md" />
        <span className="absolute top-2 left-2 bg-black/40 text-white px-2 py-1 text-xs rounded">Từ Hồ Chí Minh</span>
      </div>

      <div className="px-5 py-4">
        <p className="text-[16px] font-semibold text-gray-900">
          Đà Nẵng - Cao Nguyên Bà Nà - Ngũ Hành Sơn - Phố Cổ Hội An
        </p>

        <p className="text-[14px] text-gray-500 m-1">
          Trải nghiệm tuyệt vời tại Đà Nẵng với những bãi biển đẹp và không khí trong lành.
        </p>

        <div className="text-gray-600 text-sm space-y-2 mt-2">
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-gray-500" />
            <span>3 ngày 2 đêm</span>
          </div>
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-500" />
            <span>23/03/2025</span>
          </div>
          <div className="flex items-center">
            <UserOutlined className="mr-2 text-gray-500" />
            <span>Còn 10 chỗ</span>
          </div>
         
          
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-gray-700">
            <EnvironmentOutlined className="mr-2" />
            <span>Đà Nẵng</span>
          </div>
          <p className="text-lg font-bold text-red-600">5,199,000 đ</p>
        </div>
      </div>
    </div>
  );
}
