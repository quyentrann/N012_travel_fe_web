import React, { useState } from 'react';
import { Card, Tag } from 'antd';
import { StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import card from '../images/card.jpg';

function ItemBagTourBestForYou({ tour }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Ngăn chặn click vào nút trái tim bị ảnh hưởng bởi click vào Card
    setIsFavorite(!isFavorite);
  };

  const allBookings = tour.reviews?.map((review) => review.booking) || [];
  const totalOrders = allBookings.reduce(
    (sum, booking) => sum + (booking?.numberPeople || 0),
    0
  );

  // Tính khoảng thời gian tour
  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Không xác định';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${days} ngày ${days - 1} đêm`;
  };

  const averageRating = tour.reviews?.length
    ? (
        tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
        tour.reviews.length
      ).toFixed(1)
    : 'Chưa có';

  return (
    <div className="w-[1230px] flex justify-center items-center">
    <Card
      key={tour.id}
      hoverable
      className="w-[1000px] flex flex-row rounded-lg shadow-md p-4 border border-gray-200"
      onClick={() =>
        navigate('/tour-detail', { state: { id: tour.tourId } })
      }
    >

        {/* Nút yêu thích */}
        <div
          className="absolute top-2 right-2 cursor-pointer text-[20px]"
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <HeartFilled className="text-red-500" />
          ) : (
            <HeartOutlined className="text-gray-400 hover:text-red-500" />
          )}
        </div>

        <div className="flex">
          {/* Ảnh bên trái */}
          <img
            src={tour.imageURL || card}
            alt={tour.name || 'Travel'}
            className="w-[270px] h-[160px] rounded-lg object-cover"
          />

          {/* Nội dung bên phải */}
          <div className="flex flex-col justify-between ml-6">
            <span className="text-[20px] font-semibold">{tour.name}</span>

            <p className="text-gray-600 text-[16px] mt-1 line-clamp-2">
              {tour.description}
            </p>

            {/* Thông tin thêm */}
            <div className="flex flex-wrap items-center text-gray-700 text-[14px] mt-2 gap-4">
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-gray-500 text-md" />
                <span>
                  {tour.tourDetails?.[0]?.startDate
                    ? new Date(
                        tour.tourDetails[0]?.startDate
                      ).toLocaleDateString('vi-VN')
                    : 'Chưa có'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-gray-500 text-md" />
                <span>
                  {getDuration(
                    tour.tourDetails?.[0]?.startDate,
                    tour.tourDetails?.[0]?.endDate
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <UserOutlined className="text-gray-500 text-md" />
                <span>
                  {tour.availableSlot
                    ? `Còn ${tour.availableSlot} chỗ`
                    : 'Không xác định'}
                </span>
              </div>
            </div>

            {/* Địa điểm + số lượt đặt */}
            <div className="mt-4 text-md flex justify-between">
              <div>
                <Tag icon={<EnvironmentOutlined />} color="black">
                  <span className="text-md">{tour.location}</span>
                </Tag>
                <div className="w-30 flex justify-between pt-1">
                  <div className="flex items-center text-yellow-500">
                    <StarFilled className="text-gray-300" />
                    <span className="text-gray-600 ml-1">{averageRating}</span>
                  </div>
                  <p className="text-gray-700">{totalOrders} lượt đặt</p>
                </div>
              </div>
              <p className="text-[18px] font-bold text-red-600">
                {tour.price ? `${tour.price.toLocaleString()}đ` : 'Giá không có'}
              </p>
            </div>

          </div>
        </div>
      </Card>
    </div>
  );
}

export default ItemBagTourBestForYou;
