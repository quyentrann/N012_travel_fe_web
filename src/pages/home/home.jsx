import React, { useEffect, useState, useRef } from 'react';
import {
  RightCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Cascader, DatePicker, Select, Input, Button } from 'antd';
import axios from 'axios';
import { getTours } from '../../apis/tour';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../images/logo.png';
import nen1 from '../../images/BgHome.png';
import nen2 from '../../images/Boat.png';
import { useNavigate } from 'react-router-dom';
import ItemCradComponent from '../../components/ItemCradComponent';
import ItemTourComponent from '../../components/ItemTourComponent';

export default function Home() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [tours, setTours] = useState([]);
  const { Option } = Select;
  
  // const tours  = useSelector((state) => state.user.tours);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priceOptions = [
    { label: 'Dưới 1 triệu', value: '0-1000000' },
    { label: '1 triệu - 3 triệu', value: '1000000-3000000' },
    { label: '3 triệu - 5 triệu', value: '3000000-5000000' },
    { label: '5 triệu - 10 triệu', value: '5000000-10000000' },
    { label: 'Trên 10 triệu', value: '10000000-999999999' },
  ];

  const handleChange = (value) => {
    setSelected(value);
    onChange(value);
  };

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/?depth=2')
      .then((response) => {
        const data = response.data.map((province) => ({
          value: province.code,
          label: province.name,
          children: province.districts.map((district) => ({
            value: district.code,
            label: district.name,
          })),
        }));
        setLocations(data);
      })
      .catch((error) => console.error('Lỗi khi tải dữ liệu:', error));
  }, []);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getTours();
        setTours(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tour:', error);
        setTours([]);
      }
    }

    fetchTours();
  }, []);

  useEffect(() => {
    console.log(tours);
  }, [tours]);

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) throw new Error('Không tìm thấy token!');
  
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Thông tin useraaaa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy thông tin user:', error);
      return null;
    }
  };
  
  // Gọi hàm để lấy thông tin user
  useEffect(() => {
    getUserInfo();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('REFRESHTOKEN');
    localStorage.removeItem('TOKEN_EXPIRES_IN');
    localStorage.removeItem('user_info');
    
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };
  

  return (
    <div className="w-screen h-fit relative overflow-x-hidden">
      <div
        className="w-full h-full  relative px-5 pt-3 opacity-100 "
        style={{
          backgroundImage: `url(${nen1})`,
          backgroundSize: 'cover',
        }}>
        <div className="absolute bottom-0 left-0 w-full h-30 bg-gradient-to-t from-white to-transparent"></div>
        <div
          className="absolute right-0 top-0 w-1/2 opacity-100 h-full"
          style={{
            backgroundImage: `url(${nen2})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}>
          <div className="absolute bottom-0 left-0 w-full h-30 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <nav className="w-full z-50 flex justify-between items-center py-2 rounded-2xl relative">
          <div className="justify-start flex">
            <img src={logo} alt="logo" className="h-13 w-auto" />
            <span
              className="text-[26px] font-bold text-gray-900"
              style={{ fontFamily: 'Dancing Script, cursive' }}>
              TADA
            </span>
          </div>

          <div className="space-x-13 text-lg flex justify-end items-center">
            <span
              onClick={() => navigate('/home')}
              className="text-white text-[20px] cursor-pointer font-bold hover:scale-110 transition duration-150">
              Home
            </span>
            <span
              onClick={() => navigate('/home')}
              className="text-white text-[20px] cursor-pointer font-bold hover:scale-110 transition duration-150">
              About Us
            </span>
            <span
              onClick={() => navigate('/home')}
              className="text-white text-[20px] cursor-pointer font-bold hover:scale-105 transition duration-150">
              Premium
            </span>
            <span
              onClick={() => navigate('/home')}
              className="text-white text-[20px] cursor-pointer font-bold hover:scale-105 transition duration-150">
              Blogs
            </span>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 text-white text-[18px] font-bold hover:scale-105 transition duration-150">
                <UserOutlined className="text-[20px]" />
                <span>Tài khoản</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-[160px] bg-white shadow-lg rounded-md border border-gray-300 p-3 z-50">
                  {localStorage.getItem('TOKEN') ? (
                    <>
                    <button
                      className="w-full text-gray-700 py-2 text-[14px] font-semibold hover:bg-gray-100 transition text-left"
                      onClick={() => navigate('/profile')}>
                      Thông tin cá nhân
                    </button>
                    <button
                      className="w-full text-gray-700 py-2 text-[14px] font-semibold hover:bg-gray-100 transition text-left"
                      onClick={() => navigate('/orders')}>
                      Đơn mua
                    </button>
                    <button
                      className="w-full text-red-600 py-2 text-[14px] font-semibold hover:bg-gray-100 transition text-left"
                      onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </>
                  ) : (
                    <>
                     <button
                    className="w-full bg-cyan-800 text-white py-2 rounded-md text-[14px] font-semibold hover:bg-cyan-900 transition"
                    onClick={() => navigate('/login')}>
                    Đăng nhập
                  </button>
                  <p className="text-center text-gray-600 text-[11px] mt-2">
                    Bạn chưa có tài khoản?{' '}
                    <span className="text-cyan-800 font-semibold cursor-pointer hover:underline">
                      Đăng ký ngay
                    </span>
                  </p>
                    </>
                  )}
                 
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="w-1/2 pl-10 ">
          <div
            className="space-x-5 text-white mt-6 text-[14px]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="cursor-pointer hover:underline">MOUNTAIN</span>
            <span>|</span>
            <span className="cursor-pointer hover:underline">PLAINS</span>
            <span>|</span>
            <span className="cursor-pointer hover:underline">BEACHES</span>
          </div>
          <div
            className="text-[26px] font-bold text-white pt-2 ml-8"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Spend your vacation <br />
            with our activites
          </div>
          <div className="flex-row flex justify-between mt-5 items-center">
            <div className="text-[18px] font-bold text-white ">
              MOST POPULAR
            </div>

            <div className="cursor-pointer hover:scale-101">
              <RightCircleOutlined
                style={{ fontSize: '24px', color: 'white' }}
              />
            </div>
          </div>
          <div className="flex justify-between pt-2 relative">
            <ItemCradComponent />
            <ItemCradComponent />
            <ItemCradComponent />
          </div>
        </div>
        <div className="h-35 bg-white/30 relative rounded-2xl flex items-center p-4 shadow-md mt-5">
          <div className="h-21 bg-white flex flex-1 rounded-xl items-center p-4 shadow">
            <div className="flex justify-center items-center mr-7 w-60">
              <Input
                placeholder="Nhập mô tả ..."
                prefix={
                  <SearchOutlined className="text-gray-400 text-[11px] pr-3 " />
                }
                className="h-9 border border-gray-300 focus:ring-blue-500 !text-[12px] rounded-2xl"
              />
            </div>

            <div className="border-1 border-gray-200 h-20 ml-5 mr-4"></div>

            <div className="mr-6">
              <Cascader
                options={locations}
                placeholder="Accommodation"
                style={{ width: 182, height: 38 }}
                showSearch
              />
            </div>
            <div className="flex mr-6 h-16 justify-center items-center border-1 border-gray-300 w-55 rounded-[5px]">
              <div className="flex items-center justify-center mr-2">
                <CalendarOutlined className="text-gray-500 text-xl" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-[13px]">Check-in</span>
                <DatePicker
                  format="DD.MM.YYYY"
                  className="border-none text-lg"
                />
              </div>
            </div>
            <div className="flex mr-6 h-15 justify-center items-center border-1 border-gray-300 w-50 rounded-[5px]">
              <div className="flex items-center justify-center mr-2">
                <DollarOutlined className="text-gray-500 text-2xl mb-2" />
              </div>
              <div className="flex flex-col items-center">
                <Select
                  placeholder="Chọn mức giá"
                  value={selected}
                  onChange={handleChange}
                  style={{ width: 140 }}>
                  {priceOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex mr-5 h-15 justify-center items-center border-1 border-gray-300 w-45 rounded-[5px]">
              <div className="flex items-center justify-center mr-2">
                <FieldTimeOutlined className="text-gray-500 text-2xl" />
              </div>
              <div className="flex flex-col items-center">
                <Select
                  placeholder="Chọn số ngày"
                  className="border-none "
                  style={{ width: 120 }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <Select.Option key={day} value={day}>
                      {day} ngày
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end flex-1">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ height: 40, width: 120, fontSize: 16 }}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-13 px-25">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {Array.isArray(tours) &&
            tours.map((tour) => (
              <ItemTourComponent key={tour.tourId} tour={tour} />
            ))}
        </div>
      </div>

      <footer className="bg-gray-900 text-white text-center p-5 mt-10">
        <p>&copy; 2025 Travelista Tours. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
