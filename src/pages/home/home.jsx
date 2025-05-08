import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import { Carousel, Spin, message } from 'antd';
import { motion } from 'framer-motion';
import nen1 from '../../images/nen5.png';
import ItemCradComponent from '../../components/ItemCradComponent';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { fetchTours, fetchFavoriteTours } from '../../redux/tourSlice';
import { fetchLocations } from '../../redux/locationSlice';
import { fetchUnreadCount } from '../../redux/notificationSlice';
import { fetchSearchHistory } from '../../redux/searchHistorySlice';
import { logout } from '../../redux/userSlice';

const CustomPrevArrow = ({ onClick }) => (
  <div
    className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
    onClick={onClick}>
    <LeftCircleOutlined style={{ fontSize: '17px', color: 'gray' }} />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
    onClick={onClick}>
    <RightCircleOutlined style={{ fontSize: '17px', color: 'gray' }} />
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    tours,
    favoriteTours,
    loading: toursLoading,
    error: toursError,
  } = useSelector((state) => state.tours);
  const {
    history,
    loading: historyLoading,
    error: historyError,
  } = useSelector((state) => state.searchHistory);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoading(true);
      try {
        const promises = [dispatch(fetchTours()), dispatch(fetchLocations())];
        if (isAuthenticated) {
          promises.push(
            dispatch(fetchSearchHistory()),
            dispatch(fetchUnreadCount()),
            dispatch(fetchFavoriteTours()).catch((error) => {
              console.error('Error fetching favorite tours:', error);
              message.error('Không thể tải danh sách tour yêu thích!');
              if (error.status === 401 || error.status === 403) {
                localStorage.removeItem('TOKEN');
                dispatch(logout());
                navigate('/login');
              }
            })
          );
        } else {
          dispatch(resetFavoriteTours()); // Reset favoriteTours khi chưa đăng nhập
        }
        await Promise.all(promises);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchData();
  }, [dispatch, isAuthenticated, navigate]);

  const sortedTours = [...tours].sort((a, b) => {
    const totalOrdersA = a.bookings ? a.bookings.length : 0;
    const totalOrdersB = b.bookings ? b.bookings.length : 0;
    if (totalOrdersB !== totalOrdersA) {
      return totalOrdersB - totalOrdersA;
    }
    return b.tourId - a.tourId;
  });

  const handleFavoriteChange = (tourId, isFavorite) => {
    if (isAuthenticated) {
      dispatch(fetchFavoriteTours()).then(() => {
        message.success(
          isFavorite
            ? 'Đã thêm tour vào yêu thích!'
            : 'Đã xóa tour khỏi yêu thích!'
        );
      });
    }
  };

  return (
    <div className="min-h-screen font-sans w-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${nen1})`,
          backgroundPosition: 'center bottom',
        }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4">
            Khám phá hành trình mới
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-8">
            Điểm đến tuyệt vời đang chờ bạn cùng TADA
          </motion.p>
          <div onClick={() => navigate('/search')} className="cursor-pointer">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 rounded-xl p-4 max-w-3xl mx-auto shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Chọn điểm đến nào?"
                    readOnly
                    className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-cyan-600 text-gray-900 cursor-pointer"
                  />
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
                  <SearchOutlined />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Packages For You */}
      {history.length > 0 && (
        <section className="py-10 bg-gray-200">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex justify-between items-center mb-8">
              <div className="w-full">
                <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                  Gói tour chờ bạn trải nghiệm – đừng bỏ lỡ nhé!
                </h2>
              </div>
              <div className="text-end w-[75px]">
                <span
                  onClick={() => navigate('/bestforyou')}
                  className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                  Xem tất cả
                </span>
              </div>
            </div>
            <div className="relative">
              {historyLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin
                    size="large"
                    tip="Đang tải gợi ý..."
                    style={{ fontSize: '16px' }}
                  />
                </div>
              ) : historyError ? (
                <div className="text-center text-red-600">
                  Lỗi: {historyError}
                </div>
              ) : (
                <Carousel
                  dots={false}
                  arrows={true}
                  prevArrow={<CustomPrevArrow />}
                  nextArrow={<CustomNextArrow />}
                  slidesToShow={Math.min(4, history.length)}
                  slidesToScroll={1}
                  infinite={history.length > 4}
                  className="w-full">
                  {history
                    .filter((item) => item.tour !== null)
                    .map((item) => (
                      <div
                        key={item.tour?.tourId || item.id}
                        className="px-3 h-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex justify-center h-full">
                          <ItemCradComponent
                            tour={item.tour}
                            isFavorite={favoriteTours.some((fav) =>
                              fav.tour
                                ? fav.tour.tourId === item.tour.tourId
                                : fav.tourId === item.tour.tourId
                            )}
                            onFavoriteChange={handleFavoriteChange}
                          />
                        </motion.div>
                      </div>
                    ))}
                </Carousel>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular Tours */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-8">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Tour hot nhất – ai cũng chọn!
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')}
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[13px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {isInitialLoading || toursLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spin size="large" tip="Đang tải tour..." />
              </div>
            ) : toursError ? (
              <div className="text-center text-red-600">Lỗi: {toursError}</div>
            ) : sortedTours.length === 0 ? (
              <div className="text-center text-gray-600">
                Không có tour phổ biến nào.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, sortedTours.length)}
                slidesToScroll={1}
                infinite={sortedTours.length > 3}
                className="w-full carousel-container">
                {/* {sortedTours
                  .filter((tour) => tour && tour.tourId)
                  .map((tour) => (
                    <div key={tour.tourId} className="px-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                      >
                        <ItemTourBestForYou
                          key={`${tour.tourId}-${favoriteTours.some(
                            (fav) =>
                              (fav.tour ? fav.tour.tourId : fav.tourId) ===
                              tour.tourId
                          )}`}
                          tour={tour}
                          isFavorite={favoriteTours.some(
                            (fav) =>
                              (fav.tour ? fav.tour.tourId : fav.tourId) ===
                              tour.tourId
                          )}
                          onFavoriteChange={handleFavoriteChange}
                        />
                      </motion.div>
                    </div>
                  ))} */}
                {tours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={
                          isAuthenticated &&
                          favoriteTours.some((fav) =>
                            fav.tour
                              ? fav.tour.tourId === tour.tourId
                              : fav.tourId === tour.tourId
                          )
                        }
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Island & Beach Escapes */}
      <section className="py-12 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Biển xanh hay núi rừng – bạn chọn gì?
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')}
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {isInitialLoading || toursLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin
                  size="large"
                  tip="Đang tải tour..."
                  style={{ fontSize: '16px' }}
                />
              </div>
            ) : toursError ? (
              <div className="text-center text-red-600">Lỗi: {toursError}</div>
            ) : tours.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                Không có tour nào trong danh mục này.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, tours.length)}
                slidesToScroll={1}
                infinite={tours.length > 3}
                className="w-full">
                {tours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) =>
                          fav.tour
                            ? fav.tour.tourId === tour.tourId
                            : fav.tourId === tour.tourId
                        )}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Mountain & Nature Retreats */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Tour sắp khởi hành – đặt ngay kẻo lỡ!
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')}
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {isInitialLoading || toursLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin
                  size="large"
                  tip="Đang tải tour..."
                  style={{ fontSize: '16px' }}
                />
              </div>
            ) : toursError ? (
              <div className="text-center text-red-600">Lỗi: {toursError}</div>
            ) : tours.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                Không có tour nào trong danh mục này.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, tours.length)}
                slidesToScroll={1}
                infinite={tours.length > 3}
                className="w-full">
                {tours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) =>
                          fav.tour
                            ? fav.tour.tourId === tour.tourId
                            : fav.tourId === tour.tourId
                        )}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* City Adventures */}
      <section className="py-12 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Tour hot – giá sốc chỉ trong tháng này!
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')}
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {isInitialLoading || toursLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin
                  size="large"
                  tip="Đang tải tour..."
                  style={{ fontSize: '16px' }}
                />
              </div>
            ) : toursError ? (
              <div className="text-center text-red-600">Lỗi: {toursError}</div>
            ) : tours.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                Không có tour nào trong danh mục này.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, tours.length)}
                slidesToScroll={1}
                infinite={tours.length > 3}
                className="w-full">
                {tours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) =>
                          fav.tour
                            ? fav.tour.tourId === tour.tourId
                            : fav.tourId === tour.tourId
                        )}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* River & Countryside Tours */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Tour chất lượng – ai đi cũng mê!
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')}
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {isInitialLoading || toursLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin
                  size="large"
                  tip="Đang tải tour..."
                  style={{ fontSize: '16px' }}
                />
              </div>
            ) : toursError ? (
              <div className="text-center text-red-600">Lỗi: {toursError}</div>
            ) : tours.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                Không có tour nào trong danh mục này.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, tours.length)}
                slidesToScroll={1}
                infinite={tours.length > 3}
                className="w-full">
                {tours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) =>
                          fav.tour
                            ? fav.tour.tourId === tour.tourId
                            : fav.tourId === tour.tourId
                        )}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Eco & Discovery Tours */}
      <section className="py-12 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Tour sắp khởi hành – đặt liền kẻo lỡ!
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')}
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {isInitialLoading || toursLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin
                  size="large"
                  tip="Đang tải tour..."
                  style={{ fontSize: '16px' }}
                />
              </div>
            ) : toursError ? (
              <div className="text-center text-red-600">Lỗi: {toursError}</div>
            ) : tours.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                Không có tour nào trong danh mục này.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, tours.length)}
                slidesToScroll={1}
                infinite={tours.length > 3}
                className="w-full">
                {tours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) =>
                          fav.tour
                            ? fav.tour.tourId === tour.tourId
                            : fav.tourId === tour.tourId
                        )}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
