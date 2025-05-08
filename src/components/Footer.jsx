import React from 'react';

const Footer = () => (
  <footer className="bg-[#f0ede3] text-black py-1 sm:py-2">
    <div className="max-w-7xl mx-auto px-6 sm:px-4 text-center">
      {/* Nội dung cho màn hình lớn */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <h4 className="text-[16px] font-semibold mb-2">About Travel TADA</h4>
          <p className="text-[13px]">Safe and easy travel experiences.</p>
        </div>
        <div>
          <h4 className="text-[16px] font-semibold mb-2">Contact</h4>
          <p className="text-[13px]">Email: support@traveltada.vn</p>
          <p className="text-[13px]">Hotline: 1900 8888</p>
        </div>
      </div>

      {/* Dòng bản quyền cho web (ẩn trên mobile) */}
      <p className="text-[13px] sm:text-xs mt-2 hidden sm:block">
        © 2025 Travel TADA. All rights reserved.
      </p>

      {/* Dòng bản quyền gọn cho mobile */}
      <div className="block sm:hidden mt-2">
        <p className="text-[13px] text-center font-medium">
          Travel TADA © 2025
        </p>
        <p className="text-[12px] text-center text-gray-600">
          Easy trips, happy moments.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
