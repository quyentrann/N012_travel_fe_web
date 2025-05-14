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
  const token = localStorage.getItem('TOKEN');

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      message.error('Vui lòng đăng nhập để thêm/xóa tour yêu thích!');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8080/api/tour-favourites/${tour.tourId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Đã xóa tour khỏi yêu thích!');
        onFavoriteChange(tour.tourId, false);
      } else {
        await axios.post(
          'http://localhost:8080/api/tour-favourites',
          { tourId: tour.tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success('Đã thêm tour vào yêu thích!');
        onFavoriteChange(tour.tourId, true);
      }
      dispatch(fetchFavoriteTours());
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (status === 409) {
        console.warn('Tour đã trong danh sách yêu thích.');
        onFavoriteChange(tour.tourId, true);
      } else {
        console.error('Lỗi cập nhật yêu thích:', error);
        message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
      }
    }
  };

  const handleTourClick = async () => {
    if (!isAuthenticated || !token) {
      navigate(`/tour-detail?id=${tour.tourId}`);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/search-history/click/${tour.tourId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Tracked click for tour ${tour.tourId}`);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
        return;
      }
      console.error('Lỗi khi ghi nhận click tour:', error);
    }

    navigate(`/tour-detail?id=${tour.tourId}`);
  };

  return (
    <div className="w-full max-w-[170px] sm:max-w-[250px] h-[225px] sm:h-[315px] flex flex-col bg-[#fffcfa] hover:scale-101 transition-transform duration-200 sm:mb-6 sm:ml-15 ml-1">
      <Card
        cover={
          <div className="relative">
            <img
              src={tour.imageURL || card}
              alt={tour.name || 'Travel'}
              className="w-full h-[100px] md:h-[150px] object-cover rounded-t-lg"
            />
            <div
              className="absolute top-2 right-2 cursor-pointer text-[20px]"
              onClick={handleToggleFavorite}
            >
              {isAuthenticated && isFavorite ? (
                <HeartFilled style={{ color: '#CC0000', fontSize: '20px sm:24px' }} />
              ) : (
                <HeartOutlined style={{ color: '#CCCCCC', fontSize: '20px sm:24px' }} />
              )}
            </div>
          </div>
        }
        className="rounded-lg shadow-md flex flex-col h-full bg-[#fefefe] border border-gray-200"
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '4px sm:12px' }}
        onClick={handleTourClick}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="overflow-hidden">
            <span className="text-[10px] sm:text-sm md:text-[14px] font-semibold line-clamp-1 truncate">{tour.name}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-red-700 font-bold text-[9px] sm:text-xs md:text-[13px] mt-0.5">
              {tour.price ? `${tour.price.toLocaleString()}đ` : 'Giá không có'}/Người
            </p>
          </div>
          <div className="overflow-hidden">
            <p className="text-gray-600 text-[9px] sm:text-xs md:text-[12px] mt-0.5 sm:mt-2 line-clamp-2">{tour.description}</p>
          </div>
          <div className="flex justify-between items-center mt-1 sm:mt-3">
            <Tag
              icon={<EnvironmentOutlined />}
              color="black"
              className="py-0 px-1 sm:px-2"
            >
              <span className="text-[8px] sm:text-[10px] truncate">{tour.location}</span>
            </Tag>
            <p className="text-gray-700 text-[9px] sm:text-xs md:text-[13px] truncate">Còn {tour.availableSlot} chỗ</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ItemTourBestForYou;