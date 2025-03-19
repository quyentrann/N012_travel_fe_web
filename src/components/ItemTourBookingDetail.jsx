import React from "react";

export default function TourBookingForm() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white w-[450px] rounded-lg shadow-lg">
        <div className="bg-orange-400 p-3 text-white font-bold text-lg rounded-t-lg">
          Yêu cầu đặt
        </div>

        <div className="p-5">
          <p className="text-gray-600 text-sm">
            Chúng tôi sẽ liên hệ tư vấn cho bạn ngay khi nhận được yêu cầu. Vui lòng
            cung cấp các thông tin dưới đây.
          </p>

          {/* Form */}
          <div className="mt-4">
            <label className="block font-semibold mb-1">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md border-gray-400"
              placeholder="Nhập họ và tên"
            />

            <label className="block font-semibold mt-3 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md border-gray-400"
              placeholder="Nhập số điện thoại"
            />

            {/* Email */}
            <label className="block font-semibold mt-3 mb-1">Email (tùy chọn)</label>
            <input
              type="email"
              className="w-full border p-2 rounded-md border-gray-400"
              placeholder="Nhập email"
            />

            <label className="block font-semibold mt-3 mb-1">Ghi chú / Yêu cầu thêm</label>
            <textarea
              className="w-full border p-2 rounded-md focus:outline-orange-500"
              rows="3"
              placeholder="Ví dụ: đi 2 người lớn, đoàn 10 người..."
            ></textarea>

            <button className="w-full bg-orange-400 text-white py-2 mt-5 rounded-lg font-semibold hover:bg-orange-500">
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
