import React, { useState, useEffect } from 'react';
import { Rate, Input, Button, Divider, List, message, Avatar, Spin, Row, Col } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { StarOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const BookingDetail = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Lấy ID từ state
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [tour, setTour] = useState(null);
  

  console.log('Booking ID:', id);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('TOKEN');
        const response = await axios.get(`http://localhost:8080/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBooking(response.data);
        console.log("sahaaaaaaaaadaj", response.data);
        
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn đặt tour:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

//   const handleSubmitReview = async () => {
//     if (!review || rating === 0) {
//       message.error('Vui lòng nhập nhận xét và đánh giá sao.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('TOKEN');
//       const response = await axios.post(
//         `http://localhost:8080/api/bookings/review/${id}`,
//         { rating, review },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       message.success('Đánh giá của bạn đã được gửi!');
//       setReviews([...reviews, { rating, review, customerFullName: 'Bạn', reviewDate: new Date() }]);
//       setReview('');
//       setRating(0);
//     } catch (error) {
//       message.error('Không thể gửi đánh giá. Vui lòng thử lại.');
//     }
//   };

//   if (loading) {
//     return <Spin size="large" />;
//   }

//   useEffect(() => {
//     axios.get(`/api/tours/${id}`)
//       .then(res => setTour(res.data))
//       .catch(err => console.error(err));
//   }, [tourId]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <img
            src={booking?.tourImage || 'https://via.placeholder.com/300'}
            alt={booking?.tourName}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={12}>
          <h2 className="text-2xl font-semibold text-gray-800">{booking?.tourName}</h2>
          <p className="text-gray-600">{booking?.tourLocation}</p>
          <p className="mt-2 text-gray-700">{booking?.tourDescription}</p>
          <p className="font-semibold text-lg mt-4">{booking?.price}</p>
          <p className="text-sm text-gray-500 mt-2">Ngày đặt: {new Date(booking?.bookingDate).toLocaleDateString()}</p>
        </Col>
      </Row>

      <Divider />

      <h3 className="text-xl font-semibold">Đánh giá của bạn</h3>
      <div className="flex items-center mt-2">
        <Rate
          value={rating}
          onChange={(value) => setRating(value)}
          allowHalf
          character={<StarOutlined />}
        />
      </div>
      <TextArea
        rows={4}
        placeholder="Viết nhận xét của bạn..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="mt-2"
      />
      <Button
        type="primary"
        className="mt-4"
        onClick={handleSubmitReview}
        disabled={!review || rating === 0}
      >
        Gửi nhận xét
      </Button>

      <Divider />

      <h3 className="text-xl font-semibold">Nhận xét từ khách hàng khác</h3>
      <List
        itemLayout="horizontal"
        dataSource={reviews}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{item.customerFullName?.charAt(0)}</Avatar>}
              title={<span>{item.customerFullName}</span>}
              description={
                <>
                  <Rate disabled value={item.rating} allowHalf />
                  <p>{item.review}</p>
                  <small>{new Date(item.reviewDate).toLocaleDateString()}</small>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookingDetail;
