import React from 'react';
import { Card, Tag, message } from 'antd';
import { EnvironmentOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import card from '../images/card.jpg';
import { fetchFavoriteTours } from '../redux/tourSlice';

function ItemTourBestForYou({ tour, isFavorite, onFavoriteChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      message.error('Vui lòng đăng nhập để thêm/xóa tour yêu thích!');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8080/api/tour-favourites/${tour.tourId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('TOKEN')}` },
        });
        message.success('Đã xóa tour khỏi yêu thích!');
        onFavoriteChange(tour.tourId, false);
      } else {
        await axios.post(
          'http://localhost:8080/api/tour-favourites',
          { tourId: tour.tourId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('TOKEN')}` } }
        );
        message.success('Đã thêm tour vào yêu thích!');
        onFavoriteChange(tour.tourId, true);
      }
      // Cập nhật favoriteTours trong Redux
      dispatch(fetchFavoriteTours());
    } catch (error) {
      console.error('Lỗi khi cập nhật yêu thích:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleTourClick = () => {
    navigate('/tour-detail', { state: { id: tour.tourId } });
  };

  return (
    <div className="w-65 h-83 flex flex-col mx-5 bg-[#fffcfa] hover:scale-101">
      <Card
        cover={
          <div className="relative">
            <img
              src={tour.imageURL || card}
              alt={tour.name || 'Travel'}
              className="w-full h-[150px] object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2 cursor-pointer text-[20px]" onClick={handleToggleFavorite}>
              {isFavorite ? (
                <HeartFilled style={{ color: '#CC0000', fontSize: '24px' }} />
              ) : (
                <HeartOutlined style={{ color: '#CCCCCC', fontSize: '24px' }} />
              )}
            </div>
          </div>
        }
        className="rounded-lg shadow-md flex flex-col h-full bg-[#fefefe] border border-gray-200"
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        onClick={handleTourClick}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="text-[14px] font-semibold">{tour.name}</span>
          </div>
          <div>
            <p className="text-red-700 font-bold text-[13px]">
              {tour.price ? `${tour.price.toLocaleString()}đ` : 'Giá không có'}/Người
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-[12px] mt-2 line-clamp-2">{tour.description}</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <Tag icon={<EnvironmentOutlined />} color="black">
              <span className="text-[10px]">{tour.location}</span>
            </Tag>
            <p className="text-gray-700 text-[13px]">Còn {tour.availableSlot} chỗ</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ItemTourBestForYou;