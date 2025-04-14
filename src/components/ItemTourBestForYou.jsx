import React from 'react';
import { Button, Card, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import card from '../images/card.jpg';

function ItemTourBestForYou({ tour }) {
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
    <div className="w-73 h-100 flex flex-col py-4 hover:scale-101 ">
      <Card
        hoverable
        cover={
          <div className="h-[180px] overflow-hidden rounded-t-lg">
            <img
              src={tour.imageURL || card}
              alt={tour.name || 'Travel'}
              className="w-full h-full object-cover"
            />
          </div>
        }
        className="rounded-lg shadow-md flex flex-col h-full"
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        onClick={() =>
          navigate('/tour-detail', { state: { id: tour.tourId } })
        }>
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="text-[16px] font-semibold">{tour.name}</span>
          </div>
          <div>
            <p className="text-red-700 font-medium text-[15px]">
              {tour.price ? `${tour.price.toLocaleString()}đ` : 'Giá không có'}
              /Người
            </p>
          </div>
          <div>
            {' '}
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
      </Card>
    </div>
  );
}

export default ItemTourBestForYou;
