import React from 'react';
import { Button, Card, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import card from '../images/card.jpg';

function ItemTourBestForYou({ tour }) {
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
    <div className="w-75 h-full flex flex-col">
      <Card
        key={tour.id}
        hoverable
        cover={
            <img
          src={tour.imageURL || card}
          alt={tour.name || 'Travel'}
           className="h-45 rounded-t-lg "
        />
        }
        className="rounded-lg shadow-md flex flex-col flex-1"
        
        onClick={() => navigate('/tour-detail', { state: { id: tour.tourId } })}>
        <span className="text-[16px] font-semibold">{tour.name}</span>
        <p className="text-gray-500">
          {' '}
          {tour.price ? `${tour.price.toLocaleString()}đ` : 'Giá không có'}
          /Người
        </p>
        <p className="text-gray-600 text-sm mt-2 flex-1">{tour.description}</p>
        <div className="flex justify-between items-center mt-2">
          <Tag
            icon={<EnvironmentOutlined />}
            color="black"
            className=" ">
                <span className='text-[10px]'>{tour.location}</span>
            
          </Tag>
          <div >
          {/* <p className='text-gray-700 text-[13px]'>Còn {tour.availableSlot} chỗ</p> */}
          </div>
        </div>
       
      </Card>
    </div>
  );
}

export default ItemTourBestForYou;
