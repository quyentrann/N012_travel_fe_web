import React, { useState, useEffect } from 'react';
import { getTourById } from '../apis/tour';
import dayjs from 'dayjs';
import axios from 'axios';
import { message } from 'antd';

export default function TourBookingForm({
  tourId,
  adults,
  children,
  infants,
  startDate,
  totalPrice,discountAmount
}) {
  const [tour, setTour] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (tourId) {
      console.log('Fetching tour:', tourId);
      getTourById(tourId)
        .then((data) => {
          console.log('API response:', data);
          setTour(data);
        })
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
  
    if (!fullName || !phone) {
      message.warning('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/bookings/book',
        {
          tourId,
          startDate,
          numberPeople: adults + children + infants,
          totalPrice: totalPrice,
          fullName,
          phone,
          email,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào request
            'Content-Type': 'application/json',
          },
        }
      );
  
      message.success('Đặt tour thành công!');
      console.log('Booking Response:', response.data);
    } catch (error) {
      message.error('Đặt tour thất bại, vui lòng thử lại!');
      console.error('Booking Error:', error.response?.data || error.message);
    }
  };
  

  return (
    <div className="px-4 py-2 ">
      <p className="text-gray-600 text-xs mb-3">
        Vui lòng cung cấp thông tin dưới đây để chúng tôi hỗ trợ bạn nhanh
        chóng.
      </p>

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
              <th className="border p-2 ">Người lớn <br/>(&gt;10 tuổi)</th>
              <th className="border p-2">Trẻ em <br/>(2 - 10 tuổi)</th>
              <th className="border p-2">Trẻ nhỏ <br/>(&lt; 2 tuổi)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium ">Giá</td>
              <td className="border p-2 text-center">
              {(tour?.price ? tour.price : 0).toLocaleString(
                        'vi-VN'
                      )}đ
              </td>
              <td className="border p-2 text-center">
              {(tour?.price
                    ? tour.price * 0.85
                    : 0
                  ).toLocaleString('vi-VN')}đ
              </td>
              <td className="border p-2 text-center">
              {(tour?.price
                    ? tour.price * 0.3
                    : 0
                  ).toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Số lượng</td>
              <td className="border">
                <p className="w-full rounded text-center appearance-none ">{adults}</p>
              </td>
              <td className="border">
              
                <p className="w-full rounded text-center appearance-none ">{children}</p>
              </td>
              <td className="border p-2">
                <p className="w-full rounded text-center appearance-none ">{infants}</p>
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Giảm giá</td>
              <td colSpan="4" className="border p-1">
                {discountAmount.toLocaleString(
                        'vi-VN'
                      )} đ
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
          onChange={(e) => setNotes(e.target.value)}
          ></textarea>

        <button
          style={{
            width: '100%',
            height: 40,
            fontSize: 16,
            fontWeight: 500,
            borderRadius: 8,
            backgroundColor: '#009EE2',
          }}
          className="text-white mt-3" onClick={handleBooking} >
          Gửi yêu cầu
        </button>
      </div>
    </div>
  );
}
