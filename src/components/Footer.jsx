// src/components/Footer.jsx
import React from 'react';

const Footer = () => (
  <footer className="bg-[#f0ede3] text-black py-3">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Về Travel TADA</h4>
          <p className="text-sm">
            Nền tảng du lịch trực tuyến mang đến những hành trình đáng nhớ, an toàn và tiện lợi.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Chính sách</h4>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/about" className="hover:underline">
                Chính sách hoàn hủy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
          <p className="text-sm">Email: support@traveltada.vn</p>
          <p className="text-sm">Hotline: 1900 8888</p>
        </div>
      </div>
      <p className="text-sm">© 2025 Travel TADA. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;