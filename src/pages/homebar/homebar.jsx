import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Carousel, Spin, message, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import nen1 from '../../images/nen5.png';
import ItemCradComponent from '../../components/ItemCradComponent';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  fetchTours,
  fetchFavoriteTours,
  resetFavoriteTours,
} from '../../redux/tourSlice';
import { fetchLocations } from '../../redux/locationSlice';
import { fetchUnreadCount } from '../../redux/notificationSlice';
import { fetchSearchHistory } from '../../redux/searchHistorySlice';
import { logout } from '../../redux/userSlice';
import card1 from '../../images/nen3.webp';
import card2 from '../../images/pq4.webp';
import card3 from '../../images/nen7.webp';
import card4 from '../../images/nen1.webp';

// Custom arrow components with rounded styling
const CustomPrevArrow = ({ onClick }) => (
  <div
    className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gradient-to-r from-sky-50 to-sky-100 text-black rounded-full p-3 shadow-lg hover:scale-110 transition"
    onClick={onClick}
  >
    <LeftCircleOutlined className="text-lg" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gradient-to-r from-sky-50 to-sky-100 text-black rounded-full p-3 shadow-lg hover:scale-110 transition"
    onClick={onClick}
  >
    <RightCircleOutlined className="text-lg" />
  </div>
);

// SVG Wave Divider Component
const WaveDivider = ({ fill = '#f8fafc', height = 80, direction = 'down' }) => (
  <svg
    viewBox={`0 0 1440 ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full"
    style={{ transform: direction === 'up' ? 'scaleY(-1)' : 'scaleY(1)' }}
  >
    <path
      d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z"
      fill={fill}
    />
  </svg>
);

const CurvedSectionWave = ({ fill = '#f8fafc' }) => (
  <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 50C240 0 480 100 720 50C960 0 1200 100 1440 50V0H0V50Z"
      fill={fill}
    />
  </svg>
);

const backgroundImages = [
  { id: 1, image: card1 },
  { id: 2, image: card2 },
  { id: 3, image: card3 },
  { id: 4, image: card4 },
];

// Hàm tính điểm đánh giá trung bình
const getAverageRating = (tour) => {
  if (!tour.reviews || tour.reviews.length === 0) return 0;
  const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / tour.reviews.length;
};

// Chọn các điểm đến nổi bật
const getFeaturedDestinations = (tours) => {
  const locationMap = tours.reduce((map, tour) => {
    const location = tour.location || tour.name.split(' ')[0] || 'Unknown';
    if (!map[location]) map[location] = [];
    map[location].push({ ...tour, averageRating: getAverageRating(tour) });
    return map;
  }, {});

  const featuredTours = Object.values(locationMap)
    .map((toursInLocation) =>
      toursInLocation.sort((a, b) => b.averageRating - a.averageRating)[0]
    )
    .filter((tour) => tour.averageRating >= 4)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  return featuredTours;
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [randomReviews, setRandomReviews] = useState([]);

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

  // Select random reviews from all tours
  useEffect(() => {
    const allReviews = tours.flatMap(tour => tour.reviews || []);
    if (allReviews.length > 0) {
      const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
      setRandomReviews(shuffled);
    } else {
      setRandomReviews([]);
    }
  }, [tours]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          dispatch(resetFavoriteTours());
        }
        await Promise.all(promises);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchData();
  }, [dispatch, isAuthenticated, navigate]);

  // Sort tours by bookings for "Tour Hot Nhất Hiện Nay"
  const sortedTours = [...tours].sort((a, b) => {
    const totalOrdersA = a.bookings ? a.bookings.length : 0;
    const totalOrdersB = b.bookings ? b.bookings.length : 0;
    return totalOrdersB !== totalOrdersA
      ? totalOrdersB - totalOrdersA
      : b.tourId - a.tourId;
  });

  // Prepare recommended tours (prioritize history, supplement with high-rated tours)
  const recommendedTours = (() => {
    const maxTours = 5;
    let result = [];

    // Add tours from history (if authenticated and history exists)
    if (isAuthenticated && history.length > 0) {
      result = history.map(item => ({
        tourId: item.tourId || item.tour?.tourId,
        tour: {
          tourId: item.tourId || item.tour?.tourId,
          name: item.tour?.name || item.name || 'Unknown Tour',
          imageURL: item.tour?.imageURL || item.imageURL,
          price: item.tour?.price || item.price,
          bookings: item.tour?.bookings || item.bookings || [],
          reviews: item.tour?.reviews || item.reviews || [],
        },
      }));
    }

    // Supplement with high-rated tours if needed
    if (result.length < maxTours) {
      const historyTourIds = new Set(result.map(tour => tour.tourId));
      const additionalTours = [...tours]
        .map(tour => ({
          ...tour,
          averageRating: getAverageRating(tour),
        }))
        .sort((a, b) => b.averageRating - a.averageRating) // Sắp xếp theo rating
        .filter(tour => !historyTourIds.has(tour.tourId))
        .slice(0, maxTours - result.length)
        .map(tour => ({
          tourId: tour.tourId,
          tour: {
            tourId: tour.tourId,
            name: tour.name || 'Unknown Tour',
            imageURL: tour.imageURL,
            price: tour.price,
            bookings: tour.bookings || [],
            reviews: tour.reviews || [],
          },
        }));
      result = [...result, ...additionalTours];
    }

    // Log for debugging
    console.log('Recommended Tours:', JSON.stringify(result.map(t => ({
      tourId: t.tourId,
      name: t.tour.name,
      averageRating: getAverageRating(t.tour),
    })), null, 2));

    return result.slice(0, maxTours);
  })();

  const handleFavoriteChange = (tourId, isFavorite) => {
    if (isAuthenticated) {
      dispatch(fetchFavoriteTours());
    }
  };

  // Handle tour click
  const handleTourClick = (tourName) => {
    navigate(`/search?query=${encodeURIComponent(tourName)}`);
  };

  const reasons = [
    {
      icon: '🌍',
      title: 'Đa Dạng Điểm Đến',
      description: 'Từ biển xanh đến núi rừng, chúng tôi có tất cả!',
      route: '/search',
    },
    {
      icon: '💰',
      title: 'Giá Cả Hợp Lý',
      description: 'Tour chất lượng với giá tốt nhất thị trường.',
      route: '/search',
    },
    {
      icon: '🤝',
      title: 'Hỗ Trợ Tận Tâm',
      description: 'Đội ngũ sẵn sàng hỗ trợ bạn 24/7.',
      route: '/about',
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-50 font-poppins">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <Header />

      {/* Hero Section */}
      <section className="relative h-[55vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <Carousel
            autoplay
            autoplaySpeed={5000}
            arrows
            className="h-full w-full"
            effect="fade"
          >
            {backgroundImages.map((bg) => (
              <div key={bg.id}>
                <img
                  src={bg.image}
                  alt={`Background ${bg.id}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </Carousel>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55 z-10"></div>
        {/* Content */}
        <div className="relative z-20 text-center text-white px-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[27px] md:text-6xl font-bold mb-4 pt-2 px-2"
          >
            Khám phá hành trình mới
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[14px] md:text-xl mb-8"
          >
            Điểm đến tuyệt vời đang chờ bạn cùng TADA
          </motion.p>
          <div onClick={() => navigate('/search')} className="cursor-pointer">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 rounded-xl p-4 max-w-3xl mx-auto shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Chọn điểm đến nào?"
                    readOnly
                    className="w-full p-1 md:p-2 rounded-lg border-none focus:ring-2 focus:ring-cyan-600 text-gray-900 cursor-pointer"
                  />
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                >
                  <SearchOutlined />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black/20 z-10 pointer-events-none"></div>
      </section>

      {/* Best Packages For You (Personalized Recommendations) */}
      {isAuthenticated && (
        <section className="relative bg-white overflow-hidden">
          {/* Subtle△ Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          ></div>
          <WaveDivider fill="#DAE7ED" direction="up" height={90} />
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex justify-between items-center mb-3 relative z-20">
              <span className="text-2xl md:text-3xl font-bold text-cyan-800">
                Gói Tour Dành Riêng Cho Bạn
              </span>
              <span
                onClick={() => navigate('/recommended')}
                className="text-cyan-600 font-medium hover:underline cursor-pointer text-sm md:text-base pr-4"
                style={{ zIndex: 20, pointerEvents: 'auto' }}
              >
                Xem tất cả
              </span>
            </div>
            {historyLoading || toursLoading ? (
              <div className="flex overflow-x-auto space-x-6 pl-10 pr-10">
                {[...Array(isMobile ? 1 : 4)].map((_, index) => (
                  <div key={index} className="px-3 w-[250px] flex-shrink-0">
                    <Skeleton
                      active
                      avatar={{ shape: 'square', size: 'large' }}
                      paragraph={{ rows: 3 }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : historyError || toursError ? (
              <div className="text-center text-red-600 bg-red-100 py-4 rounded-lg">
                Lỗi: {historyError || toursError}
              </div>
            ) : recommendedTours.length === 0 ? (
              <div className="text-center py-12">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-gray-600 mb-4"
                >
                  Không có tour nào để hiển thị.
                </motion.p>
                <button
                  onClick={() => navigate('/search')}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
                >
                  Tìm tour ngay
                </button>
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={isMobile ? 1 : Math.min(4, recommendedTours.length)}
                slidesToScroll={1}
                infinite={recommendedTours.length > (isMobile ? 1 : 4)}
                className="pl-10 pr-10"
              >
                {recommendedTours.map((tour, index) => (
                  <div key={tour.tourId} className="px-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative z-[5]"
                    >
                      <ItemCradComponent
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) =>
                          fav.tour
                            ? fav.tour.tourId === tour.tourId
                            : fav.tourId === tour.tourId
                        )}
                        onFavoriteChange={handleFavoriteChange}
                        onClick={() => handleTourClick(tour.tour.name)}
                        className="rounded-xl bg-white shadow-lg hover:shadow-xl transition"
                      />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
          <WaveDivider fill="#e6f4fa" direction="down" height={60} />
        </section>
      )}

      {/* Popular Tours */}
      <section className="bg-gradient-to-b from-cyan-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-200/20 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl md:text-3xl font-bold text-cyan-800 pt-10">
              Tour Hot Nhất Hiện Nay
            </span>
            <span
              onClick={() => navigate('/bestforyou')}
              className="text-cyan-600 font-medium hover:underline cursor-pointer text-sm md:text-base"
            >
              Xem tất cả
            </span>
          </div>
          {isInitialLoading || toursLoading ? (
            <div className="flex overflow-x-auto space-x-6 pl-20">
              {[...Array(isMobile ? 1 : 3)].map((_, index) => (
                <div key={index} className="px-3 w-[300px] flex-shrink-0">
                  <Skeleton
                    active
                    avatar={{ shape: 'square', size: 'large' }}
                    paragraph={{ rows: 3 }}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ) : toursError ? (
            <div className="text-center text-red-600 bg-red-100 py-4 rounded-lg">
              Lỗi: {toursError}
            </div>
          ) : sortedTours.length === 0 ? (
            <div className="text-center text-gray-600">
              Không có tour phổ biến nào.
            </div>
          ) : (
            <Carousel
              dots={false}
              arrows
              prevArrow={<CustomPrevArrow />}
              nextArrow={<CustomNextArrow />}
              slidesToShow={Math.min(isMobile ? 1 : 3, sortedTours.length)}
              slidesToScroll={1}
              infinite={sortedTours.length > (isMobile ? 1 : 3)}
              className="pl-7 md:pl-20"
            >
              {sortedTours.map((tour, index) => (
                <div key={tour.tourId} className="px-3 py-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ItemTourBestForYou
                      tour={tour}
                      isFavorite={
                        isAuthenticated &&
                        favoriteTours.some((fav) =>
                          fav.tour ? fav.tour.tourId === tour.tourId : fav.tourId === tour.tourId
                        )
                      }
                      onFavoriteChange={handleFavoriteChange}
                      className={`rounded-2xl bg-white shadow-lg hover:shadow-xl transition ${
                        index === 0 ? 'border-2 border-cyan-600 relative' : ''
                      }`}
                    >
                      {index === 0 && (
                        <span className="absolute top-2 right-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
                          Hot
                        </span>
                      )}
                    </ItemTourBestForYou>
                  </motion.div>
                </div>
              ))}
            </Carousel>
          )}
        </div>
        <WaveDivider fill="#e6f4fa" direction="down" height={40} />
        <WaveDivider fill="#e6f4fa" direction="down" height={70} />
      </section>

      {/* Featured Destinations (Grid Layout) */}
      <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-200/20 rounded-full translate-x-16 translate-y-16"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl md:text-3xl font-bold text-cyan-800">
              Điểm Đến Nổi Bật
            </span>
            <span
              onClick={() => navigate('/search')}
              className="text-cyan-600 font-medium hover:underline cursor-pointer text-sm md:text-base"
            >
              Khám phá thêm
            </span>
          </div>
          {isInitialLoading || toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 bg-gray-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : toursError ? (
            <div className="text-center text-red-600">Lỗi: {toursError}</div>
          ) : tours.length === 0 ? (
            <div className="text-center py-12">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-gray-600 mb-4"
              >
                Chưa có điểm đến nào để hiển thị.
              </motion.p>
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
              >
                Tìm điểm đến ngay
              </button>
            </div>
          ) : (
            (() => {
              const featuredDestinations = getFeaturedDestinations(tours);
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredDestinations.length > 0 ? (
                    <>
                      {/* Ô lớn cho điểm đến đầu tiên */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2 relative rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer"
                        onClick={() => navigate(`/tour-detail?id=${featuredDestinations[0].tourId}`)}
                      >
                        <img
                          src={featuredDestinations[0].imageURL}
                          alt={featuredDestinations[0].location || featuredDestinations[0].name}
                          className="w-full h-90 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {featuredDestinations[0].location || featuredDestinations[0].name}
                          </h3>
                          <p className="text-white text-sm line-clamp-2">
                            {featuredDestinations[0].description || 'Khám phá vẻ đẹp độc đáo của điểm đến này!'}
                          </p>
                          <button
                            onClick={() => navigate(`/tour-detail?id=${featuredDestinations[0].tourId}`)}
                            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition w-fit"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                        <span className="absolute top-4 right-4 bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
                          Nổi bật
                        </span>
                      </motion.div>
                      {/* Các ô nhỏ cho các điểm đến còn lại */}
                      {featuredDestinations.slice(1).map((dest, index) => (
                        <motion.div
                          key={dest.tourId}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                          className="relative rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer mx-4"
                          onClick={() => navigate(`/tour-detail?id=${dest.tourId}`)}
                        >
                          <img
                            src={dest.imageURL}
                            alt={dest.location || dest.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-cyan-800 mb-1">
                              {dest.location || dest.name}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {dest.description || 'Trải nghiệm tuyệt vời tại điểm đến này!'}
                            </p>
                            <button
                              onClick={() => navigate(`/tour-detail?id=${dest.tourId}`)}
                              className="mt-2 text-cyan-600 hover:underline text-sm"
                            >
                              Khám phá
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center col-span-3 text-gray-600">
                      Không có điểm đến nổi bật nào.
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-white to-cyan-50">
        <WaveDivider fill="#e6f4fa" direction="up" height={60} />
        <WaveDivider fill="#e6f4fa" direction="up" height={40} />
        <div className="max-w-7xl mx-auto px-6 text-center pb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-cyan-800 mb-12">
            Vì Sao Chọn TADA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className="p-6 bg-white rounded-2xl shadow-lg cursor-pointer"
              >
                <button
                  onClick={() => navigate(reason.route)}
                  className="w-full h-full flex flex-col items-center justify-center text-left focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  aria-label={`Tìm hiểu thêm về ${reason.title}`}
                >
                  <div className="w-16 h-16 mb-4 bg-cyan-100 rounded-full flex items-center justify-center text-3xl">
                    {reason.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-cyan-800 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600">{reason.description}</p>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-15 md:py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-cyan-800 mb-10">
            Khách Hàng Nói Gì Về TADA
          </h2>
          {randomReviews.length === 0 ? (
            <div className="text-gray-600">Chưa có đánh giá nào.</div>
          ) : (
            <Carousel
              dots={false}
              arrows
              prevArrow={<CustomPrevArrow />}
              nextArrow={<CustomNextArrow />}
              slidesToShow={Math.min(isMobile ? 1 : 3, randomReviews.length)}
              slidesToScroll={1}
              infinite={randomReviews.length > (isMobile ? 1 : 3)}
            >
              {randomReviews.map((review, index) => (
                <div key={review.reviewId} className="px-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 bg-white rounded-2xl shadow-lg h-[160px] my-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarFilled
                            key={i}
                            className={`text-yellow-500 ${
                              i < review.rating ? '' : 'opacity-30'
                            }`}
                            style={{ color: '#D9AB0C' }}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 italic mb-4 line-clamp-3">
                        "{review.comment}"
                      </p>
                    </div>
                    <h4 className="text-lg font-semibold text-cyan-800">
                      {review.customerFullName}
                    </h4>
                  </motion.div>
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </section>
      <WaveDivider fill="#e6f4fa" direction="down" height={70} />
      <Footer />
    </div>
  );
};

export default Home;