import React, { useState } from 'react';
import { Button, Card, Tag } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import card from '../images/card.jpg';

function ItemTourBestForYou({ tour }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="w-65 h-83 my-5 flex flex-col mx-5 bg-[#fffcfa] hover:scale-101">
      <Card
        cover={
          <div className="overflow-hidden rounded-t-lg relative bg-[#fffcfa]">
            <img
              src={tour.imageURL || card}
              alt={tour.name || 'Travel'}
              className="w-full h-[150px] object-cover pt-5 px-4 "
            />
            <div
              className="absolute top-1 right-1 cursor-pointer text-[20px] "
              onClick={handleToggleFavorite}>
              {isFavorite ? (
                <HeartFilled style={{ color: '#CC0000', fontSize: '24x' }} />
              ) : (
                <HeartFilled style={{ color: '#CCCCCC', fontSize: '24px' }} />
              )}
            </div>

            <div className="flex flex-col justify-between h-full bg-[#fffcfa] px-5 pt-2 pb-8">
              <div className='pt-1'>
                <span className="text-[16px] font-semibold">{tour.name}</span>
              </div>
              <div className=''>
                <p className="text-red-700 font-bold text-[15px]">
                  {tour.price
                    ? `${tour.price.toLocaleString()}đ`
                    : 'Giá không có'}
                  /Người
                </p>
              </div>
              <div className=''>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {tour.description}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <Tag icon={<EnvironmentOutlined />} color="black">
                  <span className="text-[10px]">{tour.location}</span>
                </Tag>
                <p className="text-gray-700 text-[13px]">
                  Còn {tour.availableSlot} chỗ
                </p>
              </div>
            </div>
          </div>
        }
        className="rounded-lg shadow-md flex flex-col h-full bg-[#fffcfa]"
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        onClick={() =>
          navigate('/tour-detail', { state: { id: tour.tourId } })
        }></Card>
    </div>
  );
}

export default ItemTourBestForYou;
