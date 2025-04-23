import React, { useState, useEffect } from 'react';
import { getTourById } from '../apis/tour';
import dayjs from 'dayjs';
import axios from 'axios';
import { message, Button, Modal, Spin } from 'antd';

export default function TourBookingForm({
  tourId,
  adults,
  children,
  infants,
  discountAmount,
  startDate,
  totalPrice,
  priceForOneAdult,
  priceForOneChild,
  priceForOneInfant,
}) {
  const [tour, setTour] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false); // Trạng thái đặt tour thành công
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [bookingId, setBookingId] = useState(null); // Thêm useState để lưu bookingId
  const [isProcessing, setIsProcessing] = useState(false);

  const holidays = [
    '01-01',
    '03-08',
    '04-30',
    '05-01',
    '09-02',
    '12-25',
    '11-20',
    '07-27',
    '08-19',
    '10-10',
    '09-15',
    '12-23',
  ];
  
  useEffect(() => {
    if (tourId) {
      getTourById(tourId)
        .then((data) => setTour(data))
        .catch((err) => console.error('Lỗi API:', err));
    }
  }, [tourId]);

  useEffect(() => {
    if (tourId) {
      getTourById(tourId)
        .then((data) => setTour(data))
        .catch((err) => console.error('Lỗi API:', err));
    }
  }, [tourId]);

  const handleBooking = async () => {
    const token = localStorage.getItem('TOKEN');
  
    if (!fullName || !phone || !email) {
      message.warning('Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Email!');
      return;
    }
  
    if (!startDate) {
      message.warning('Vui lòng chọn ngày khởi hành!');
      return;
    }
  
    // Kiểm tra số lượng người
    if (adults < 0 || children < 0 || infants < 0) {
      message.error('Số lượng người lớn, trẻ em, hoặc trẻ nhỏ không được âm!');
      return;
    }
  
    const totalPeople = adults + children + infants;
    if (totalPeople <= 0) {
      message.error('Vui lòng chọn ít nhất một người tham gia!');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/bookings/book',
        {
          tourId,
          numberPeople: totalPeople,
          totalPrice,
          fullName,
          phoneNumber: phone,
          numberAdults: adults,
          numberChildren: children,
          numberInfants: infants,
          departureDate: startDate, // Thêm departureDate
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      const receivedBookingId = response.data.bookingId;
      console.log('Booking ID nhận được:', receivedBookingId);
      if (!receivedBookingId) {
        throw new Error('Không nhận được bookingId từ API!');
      }
      setBookingId(receivedBookingId);
      setIsBookingSuccess(true);
      setIsModalVisible(true);
    } catch (error) {
      message.error(
        error.response?.data || 'Đặt tour thất bại, vui lòng thử lại!'
      );
      console.error('Booking Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToPayment = async (bookingId, totalPrice) => {
    if (!bookingId || !totalPrice) {
      console.error('Thiếu bookingId hoặc totalPrice!');
      message.error('Không thể tạo thanh toán do thiếu thông tin!');
      return;
    }
  
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8080/api/payment/vnpay-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, totalPrice }),
      });
  
      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        console.error('Không nhận được paymentUrl từ API!');
        message.error('Không thể tạo liên kết thanh toán!');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán:', error);
      message.error('Lỗi khi tạo thanh toán, vui lòng thử lại!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeepBooking = () => {
    setIsModalVisible(false); // Đóng modal khi người dùng quay lại
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('TOKEN');
    if (storedToken) {
      try {
        const payload = JSON.parse(
          atob(storedToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        console.log('Decoded Token:', payload);

        setEmail(payload.sub || ''); // Email vẫn có trong token

        // Gọi API lấy thông tin user đầy đủ
        fetch('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.customer) {
              setFullName(data.customer.fullName || '');
              setPhone(data.customer.phoneNumber || '');
            }
          })
          .catch((error) => console.error('Lỗi khi lấy user info:', error));
      } catch (error) {
        console.error('Lỗi khi parse TOKEN:', error);
      }
    }
  }, []);

  return (
    <div className="px-4 py-2 ">
      <p className="text-gray-600 text-xs mb-3">
        Vui lòng kiểm tra và cung cấp thông tin đầy đủ trước khi gửi yêu cầu.
        Chúng tôi sẽ liên hệ và hỗ trợ bạn nhanh chóng.
      </p>
      {loading && (
        <div className="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-opacity-50 z-50">
          <Spin size="large" />
        </div>
      )}

      {/* Bảng thông tin tour */}
      <div className="border-b mb-3">
        <h3 className="font-medium text-sm text-gray-700">Thông tin tour</h3>
        <table className="min-w-full mt-2">
          <tbody>
            <tr>
              <td className="pb-1 px-2 font-medium text-gray-600 text-[13px] ">
                Tên tour
              </td>
              <td className="pb-1  font-medium text-gray-600 text-[14px] ">
                <p>{tour?.name}</p>
              </td>
            </tr>
            <tr>
              <td className="px-2 font-medium text-gray-600 text-[13px]">
                Số người
              </td>
              <td className="font-medium text-gray-600 text-[14px] ">
                <p>{adults + children + infants}</p>
              </td>
            </tr>
            <tr>
              <td className="py-1 px-2 font-medium text-gray-600 text-[13px]">
                Ngày đi
              </td>
              <td>
                <p>
                  {startDate
                    ? dayjs(startDate).format('DD/MM/YYYY')
                    : 'Chưa có ngày khởi hành'}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng chi tiết giá */}
      <div className="border-b mb-3">
        <h3 className="font-medium text-sm text-gray-700 py-2">Chi tiết giá</h3>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 ">Loại giá</th>
              <th className="border p-2 ">
                Người lớn <br />
                (&gt;10 tuổi)
              </th>
              <th className="border p-2">
                Trẻ em <br />
                (2 - 10 tuổi)
              </th>
              <th className="border p-2">
                Trẻ nhỏ <br />
                (&lt; 2 tuổi)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium ">Giá</td>
              <td className="border p-2 text-center">
                {priceForOneAdult.toLocaleString('vi-VN')}đ
              </td>
              <td className="border p-2 text-center">
                {priceForOneChild.toLocaleString('vi-VN')}đ
              </td>
              <td className="border p-2 text-center">
                {priceForOneInfant.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Số lượng</td>
              <td className="border">
                <p className="w-full rounded text-center appearance-none ">
                  {adults}
                </p>
              </td>
              <td className="border">
                <p className="w-full rounded text-center appearance-none ">
                  {children}
                </p>
              </td>
              <td className="border p-2">
                <p className="w-full rounded text-center appearance-none ">
                  {infants}
                </p>
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Giảm giá</td>
              <td colSpan="4" className="border p-1">
                {discountAmount.toLocaleString('vi-VN')} đ
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">Tổng giá</td>
              <td colSpan="4" className="border p-2 font-bold">
                {totalPrice.toLocaleString('vi-VN')} đ
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Thông tin cá nhân */}
      <div className="mt-3">
        <label className="block font-medium text-xs mb-1">
          Họ và Tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border p-1.5 rounded-md border-gray-400 text-xs"
          placeholder="Nhập họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="block font-medium text-xs mt-2 mb-1">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border p-1.5 rounded-md border-gray-400 text-xs"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block font-medium text-xs mt-2 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="w-full border p-1.5 rounded-md border-gray-400 text-xs"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block font-medium text-xs mt-2 mb-1">
          Ghi chú / Yêu cầu thêm
        </label>
        <textarea
          className="w-full border p-1.5 rounded-md focus:outline-orange-500 text-xs"
          rows="3"
          placeholder="Ví dụ: đi 2 người lớn, đoàn 10 người..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}></textarea>

        <button
          style={{
            width: '100%',
            height: 40,
            fontSize: 16,
            fontWeight: 500,
            borderRadius: 8,
            backgroundColor: '#009EE2',
          }}
          className="text-white mt-3"
          onClick={handleBooking}
          disabled={loading}>
          Gửi yêu cầu
        </button>

        {/* Modal thông báo thành công */}
        <Modal
          title="Đặt tour thành công!"
          visible={isModalVisible}
          onCancel={handleKeepBooking}
          footer={[
            <Button key="back" onClick={handleKeepBooking}>
              Để sau
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => handleRedirectToPayment(bookingId, totalPrice)}
              disabled={!bookingId || isProcessing}>
              Đi đến thanh toán
            </Button>,
          ]}>
          <p>
            Chúng tôi đã nhận được yêu cầu của bạn. Vui lòng kiểm tra email để
            biết thêm chi tiết.
          </p>
        </Modal>
      </div>
    </div>
  );
}
