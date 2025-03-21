import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import card from '../../images/card.jpg';
import {
  Button,
  Carousel,
  DatePicker,
  Dropdown,
  Menu,
  Collapse,
  theme,
  Tabs,
  Typography,
} from 'antd';

import {
  CalendarOutlined,
  TagOutlined,
  MinusOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  CheckOutlined,
  CaretRightOutlined,
  GiftOutlined
} from '@ant-design/icons';

const promotions = [{ key: '1', label: 'Giảm 10% cho nhóm trên 5 người' }];

const { Title, Paragraph } = Typography;

const itemss = [
  {
    key: '1',
    label: 'Giá bao gồm',
    children: (
      <Typography>
        <Title level={5}>Vận Chuyển:</Title>
        <Paragraph>- Vé máy bay khứ hồi theo đoàn.</Paragraph>
        <Paragraph>
          - Thuế sân bay hai nước, phụ phí xăng dầu, an ninh hàng không.
        </Paragraph>
        <Paragraph>- Xe tham quan như chương trình.</Paragraph>

        <Title level={5}>Lưu Trú:</Title>
        <Paragraph>
          - Khách sạn 3 sao theo tiêu chuẩn địa phương, 2 khách/phòng.
        </Paragraph>

        <Title level={5}>Khác:</Title>
        <Paragraph>- Ăn uống theo chương trình.</Paragraph>
        <Paragraph>- Hướng dẫn viên suốt tuyến.</Paragraph>
        <Paragraph>- Vé tham quan theo chương trình.</Paragraph>
        <Paragraph>- Tặng 04 khách/1 đèn lồng tại phố cổ Thập Phần.</Paragraph>
        <Paragraph>- Tặng một ly trà sữa trân châu Đài Loan.</Paragraph>
        <Paragraph>- Tặng một chiếc bánh bao Khách Gia.</Paragraph>
      </Typography>
    ),
  },
  {
    key: '2',
    label: 'Giá không bao gồm',
    children: (
      <Typography>
        <Paragraph>- Bia hay nước ngọt trong các bữa ăn.</Paragraph>
        <Paragraph>- Vé máy bay khứ hồi theo đoàn.</Paragraph>
        <Paragraph>- Chi phí cá nhân: điện thoại, giặt ủi…</Paragraph>
        <Paragraph>- Vé cáp treo đi Bà Nà, công viên Châu Á.</Paragraph>
        <Paragraph>- 01 bữa trưa ngày thứ 1 theo chương trình.</Paragraph>
        <Paragraph>- Vé xem pháo hoa</Paragraph>
        <Paragraph>- Chi phí bãi biển: dù, võng, tắm nước ngọt…</Paragraph>
      </Typography>
    ),
  },
  {
    key: '3',
    label: 'Phụ thu',
    children: (
      <Typography>
        <Paragraph>
          - Trẻ em dưới 2 tuổi: 30% giá tour người lớn (sử dụng chung dịch vụ
          người lớn)
        </Paragraph>
        <Paragraph>
          - Trẻ em từ 2 tuổi - dưới 12 tuổi: 85% giá tour người lớn (không có
          chế độ giường riêng).
        </Paragraph>
        <Paragraph>
          - Trẻ em đủ 12 tuổi trở lên: 100% giá tour người lớn.
        </Paragraph>
        <Paragraph>
          - Hai người lớn chỉ kèm một bé, bé thứ hai tính giá người lớn.
        </Paragraph>
        <Title level={5}>Quy định về thanh toán</Title>
        <Paragraph>
          - Khách hàng cần thanh toán 100% chi phí tour trước ngày khởi hành ít
          nhất 5 ngày.
        </Paragraph>
        <Paragraph>
          - Vé máy bay, tàu, xe được xuất sau khi xác nhận thanh toán. Các vé
          này không được hoàn, đổi tên hoặc thay đổi lịch trình.
        </Paragraph>
        <Paragraph>
          - Hoàn tiền (nếu có) sẽ được chuyển vào tài khoản thanh toán ban đầu.
        </Paragraph>
        <Paragraph>
          - Thời gian xử lý hoàn tiền phụ thuộc vào đối tác cung cấp dịch vụ.
        </Paragraph>
      </Typography>
    ),
  },
  {
    key: '4',
    label: 'Hủy đổi',
    children: (
      <Typography>
        <Title level={5}>Quy định về hủy tour</Title>

        <p className="text-[14px] font-medium">Hủy tour ngày lễ, tết</p>
        <Paragraph>
          - Trước 30 ngày: Chịu phí 20% giá trị tour và toàn bộ chi phí vé (vé
          máy bay, tàu, xe).
        </Paragraph>
        <Paragraph>
          - Từ 15-29 ngày: Chịu phí 40% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 7-14 ngày: Chịu phí 60% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 3-6 ngày: Chịu phí 80% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Trong vòng 2 ngày hoặc không tham gia: Chịu phí 100% giá trị tour và
          toàn bộ chi phí vé.
        </Paragraph>
        <p className="text-[14px] font-medium">Hủy tour ngày thường</p>
        <Paragraph>
          - Trước 14 ngày: Chịu phí 10% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 7-13 ngày: Chịu phí 30% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 4-6 ngày: Chịu phí 50% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 1-3 ngày: Chịu phí 70% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Trong vòng 1 ngày hoặc không tham gia: Chịu phí 100% giá trị tour và
          toàn bộ chi phí vé.
        </Paragraph>
        <Title level={5}>Quy định về đổi tour</Title>
        <Paragraph>
          - Khách hàng có thể đổi tour trước ngày khởi hành ít nhất 7 ngày (đối
          với tour ngày thường) hoặc trước 15 ngày (đối với tour ngày lễ, Tết).
        </Paragraph>
        <Paragraph>
          - Việc đổi tour phụ thuộc vào tình trạng chỗ trống và điều kiện của
          tour mới.
        </Paragraph>
        <Paragraph>
          - Nếu tour mới có giá cao hơn, khách hàng cần thanh toán phần chênh
          lệch.
        </Paragraph>
        <Paragraph>
          - Nếu tour mới có giá thấp hơn, khách hàng không được hoàn lại phần
          chênh lệch.
        </Paragraph>
        <Paragraph>
          - Trường hợp khách hàng muốn đổi tour sát ngày khởi hành (trong vòng 6
          ngày đối với tour ngày thường và 14 ngày đối với tour lễ, Tết), sẽ áp
          dụng phí hủy tour theo quy định.
        </Paragraph>
        <Paragraph>
          - Phí hủy phụ thuộc vào thời gian báo hủy, khách cần xem kỹ chính sách
          trước khi đăng ký.
        </Paragraph>
      </Typography>
    ),
  },
  {
    key: '5',
    label: 'Lưu ý',
    children: (
      <Typography>
        <Title level={5}>Giấy Tờ Tùy Thân</Title>
        <Paragraph>
          - Trẻ em dưới 12 tuổi: Giấy khai sinh (bản chính hoặc sao y có công
          chứng).
        </Paragraph>
        <Paragraph>
          - Trẻ từ 14 tuổi: Bắt buộc có CMND hoặc Passport. Nếu chưa có, cần
          Giấy xác nhận nhân thân + Giấy khai sinh.
        </Paragraph>
        <Paragraph>
          - Khách nước ngoài/Việt kiều: Passport và Visa Việt Nam còn hạn. Nếu
          visa nhập cảnh 1 lần, cần tự làm lại visa trước khi đi tour.
        </Paragraph>
        <Title level={5}>Điều Kiện Tham Gia Tour</Title>
        <Paragraph>
          - Khách từ 55 tuổi (nữ) / 60 tuổi (nam): Khuyến khích có người thân đi
          cùng.
        </Paragraph>
        <Paragraph>
          - Khách từ 70 tuổi trở lên: Bắt buộc có người thân dưới 55 tuổi đi
          cùng.
        </Paragraph>
        <Paragraph>- Không nhận khách từ 80 tuổi trở lên..</Paragraph>
        <Paragraph>
          - Khách mang thai trên 5 tháng: Không được tham gia tour.
        </Paragraph>
        <Paragraph>
          - Khách từ 55 tuổi (nữ) / 60 tuổi (nam): Khuyến khích có người thân đi
          cùng.
        </Paragraph>
        <Paragraph>
          Trẻ dưới 18 tuổi: Nếu không đi cùng bố mẹ, cần có giấy ủy quyền có xác
          nhận chính quyền.
        </Paragraph>
        <Title level={5}>Quy Định Khi Tham Gia Tour</Title>
        <Paragraph>
          - Giờ bay, lịch trình có thể thay đổi do hãng hàng không hoặc điều
          kiện thực tế.
        </Paragraph>
        <Paragraph>- Không tách đoàn khi tham gia tour.</Paragraph>
        <Paragraph>
          - Không mang thực phẩm bên ngoài vào nhà hàng/khách sạn.
        </Paragraph>
        <Paragraph>- Hành lý & tư trang do khách tự bảo quản.</Paragraph>
        <Paragraph>
          - Tour bị hủy do bất khả kháng (thiên tai, an ninh, vấn đề hàng
          không), công ty sẽ điều chỉnh lịch trình nhưng không chịu trách nhiệm
          bồi thường.
        </Paragraph>
      </Typography>
    ),
  },
  {
    key: '6',
    label: 'Hướng dẫn viên',
    children: (
      <Typography>
        <Paragraph>
          - Hướng Dẫn Viên (HDV) sẽ liên lạc với Quý Khách khoảng 2 ngày trước
          khi khởi hành để sắp xếp giờ đón và cung cấp các thông tin cần thiết
          cho chuyển đi.
        </Paragraph>
      </Typography>
    ),
  },
];
export default function TourDetail() {
    const navigate = useNavigate();
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 15,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const listImageTour = [
    { id: 1, image: card },
    { id: 2, image: card },
    { id: 3, image: card },
    { id: 4, image: card },
    { id: 5, image: card },
    { id: 6, image: card },
  ];

  const menu = (
    <Menu>
      {promotions.map((promo) => (
        <Menu.Item key={promo.key}>{promo.label}</Menu.Item>
      ))}
    </Menu>
  );

  const benefits = [
    ['Vé máy bay', 'Visa', 'Khách sạn 3*'],
    ['Bữa ăn', 'Xe tham quan', 'Vé tham quan'],
    ['Hướng dẫn viên', 'Bảo hiểm du lịch'],
  ];

  const items = [
    {
      key: '1',
      label: (
        <div>
          <span>Ngày 1</span>
          <span style={{ color: 'gray', marginLeft: 10 }}>
            Hồ Chí Minh - Đài Trung
          </span>
        </div>
      ),
      children: <p>Nội dung chuyến đi.</p>,
      style: panelStyle,
    },
    {
      key: '2',
      label: (
        <div>
          <span>Ngày 2</span>
          <span style={{ color: 'gray', marginLeft: 10 }}>
            Đài Trung - Du Thuyền Hồ Nhật Nguyệt
          </span>
        </div>
      ),
      children: <p>Nội dung chuyến đi.</p>,
      style: panelStyle,
    },
    {
      key: '3',
      label: (
        <div>
          <span>Ngày 3</span>
          <span style={{ color: 'gray', marginLeft: 10 }}>
            Đài Trung - Đài Bắc
          </span>
        </div>
      ),
      children: <p>Nội dung chuyến đi.</p>,
      style: panelStyle,
    },
    {
      key: '4',
      label: (
        <div>
          <span>Ngày 4</span>
          <span style={{ color: 'gray', marginLeft: 10 }}>
            Đài Bắc - Hồ Chí Minh
          </span>
        </div>
      ),
      children: <p>Nội dung chuyến đi.</p>,
      style: panelStyle,
    },
  ];

  <Collapse items={items} />;

  return (
    <div>
      <div className="h-full w-screen px-10 py-5 bg-[#f8f8f8]">
        <div>
          <p className="text-[30px] font-bold px-5">
            Tour Côn Đảo, Bà Rịa - Vũng Tàu: Du lịch Côn Đảo huyền thoại
          </p>
        </div>
        <div className="flex h-full w-full mt-3 ">
          <div className="w-2/3 px-5 min-h-screen ">
            <div className="rounded-[8px] border-1 border-gray-300 shadow">
              <Carousel autoplay arrows>
                {listImageTour.map((tour) => (
                  <div key={tour.id}>
                    <img
                      src={tour.image}
                      alt={`Tour ${tour.id}`}
                      className="h-120 w-full rounded-[5px]"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="sticky top-0 bg-white shadow z-50">
              <nav className="h-18 mt-5 font-semibold flex justify-between text-[17px] ">
                <button
                  className="hover:scale-110"
                  onClick={() => scrollToSection('tong-quan')}>
                  Tổng Quan
                </button>

                <button
                  className="hover:scale-110"
                  onClick={() => scrollToSection('lich-trinh')}>
                  Lịch Trình Tour
                </button>
                <button
                  className="hover:scale-110"
                  onClick={() => scrollToSection('luu-y')}>
                  Điều Kiện Tour
                </button>
                <button
                  className="hover:scale-110"
                  onClick={() => scrollToSection('danh-gia')}>
                  Đánh Giá
                </button>
                <button
                  className="hover:scale-110"
                  onClick={() => scrollToSection('tour-tuong-tu')}>
                  Tour Tương Tự
                </button>
              </nav>
            </div>

            <div className="bg-white mt-4 rounded-[5px] p-5 shadow">
              <div className="flex justify-between pb-3 text-[16px] ">
                <p className="font-medium ">
                  <EnvironmentOutlined className="pr-1" />
                  Khởi hành từ:{' '}
                  <span className="font-bold text-[17px]">Hồ Chí Minh</span>
                </p>
                <p className="font-medium ">
                  Mã Tour: <span className="font-bold text-[17px]">TO2467</span>
                </p>
              </div>
              <div className="border-1 border-gray-100"></div>
              <div className="text-[18px] font-bold pt-5">
                Tour Trọn Gói Bao Gồm
              </div>
              <div className="flex w-full mt-5 text-[14px]">
                {benefits.map((column, index) => (
                  <ul key={index} className="space-y-7 w-2/3">
                    {column.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckOutlined style={{ color: '#1E90FF' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <div className="bg-white mt-4 rounded-[5px] p-5 shadow">
              <div className="text-[18px] font-bold pb-5">
                Điểm Nhấn Hành Trình
              </div>
              <p className="font-medium text-[14px]">
                Du lịch Đà Nẵng mùa Xuân - Cao Nguyên Bà Nà - Hội An từ Sài Gòn
                2025.{' '}
                <span className="font-normal">
                  Đón mùa xuân tươi mới tại Đà Nẵng - thành phố đáng sống nhất
                  Việt Nam, với những trải nghiệm tuyệt vời tại Cao Nguyên Bà Nà
                  và phố cổ Hội An. Thả mình giữa mây trời trên Bà Nà Hills,
                  chiêm ngưỡng cảnh sắc thơ mộng và hòa mình vào không gian văn
                  hóa độc đáo tại Hội An – nơi thời gian dường như lắng đọng.
                  Khởi hành từ Sài Gòn, hành trình này sẽ mang đến cho bạn những
                  khoảnh khắc khó quên trong mùa xuân rạng rỡ!
                </span>
              </p>
              <div className="text-[14px] pt-5">
                <p className="text-[16px] font-medium pb-2">
                  Trải nghiệm thú vị trong tour
                </p>
                <div className="pl-5">
                  <p className="pb-4">
                    <CheckOutlined
                      style={{ color: '#228B22', paddingRight: '5px' }}
                    />
                    Trải nghiệm đạp xe trượt trên đường ray qua Cầu Nakdong
                  </p>
                  <p className="pb-4">
                    <CheckOutlined
                      style={{ color: '#228B22', paddingRight: '5px' }}
                    />
                    Tặng vé trải nghiệm đi Phà thả mồi cho Hải Âu ăn ngắm hoàng
                    hôn
                  </p>
                  <p className="pb-4">
                    <CheckOutlined
                      style={{ color: '#228B22', paddingRight: '5px' }}
                    />
                    Khám phá ngôi làng Gamcheon- Santorini dịu dàng của Hàn Quốc
                  </p>
                  <p className="pb-4">
                    <CheckOutlined
                      style={{ color: '#228B22', paddingRight: '5px' }}
                    />
                    Tham gia làm kim chi và diện trang phục truyền thống Hàn
                    quốc – Hanbok
                  </p>
                  <p className="pb-4">
                    <CheckOutlined
                      style={{ color: '#228B22', paddingRight: '5px' }}
                    />
                    Điểm tham quan: Làng Văn hóa Gamcheon, Cảnh Phúc Cung
                    Gyeongbok
                  </p>
                  <p className="pb-4">
                    <CheckOutlined
                      style={{ color: '#228B22', paddingRight: '5px' }}
                    />
                    Chủ đề: Văn hóa, Mua sắm, Khám phá, Ẩm thực
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-white my-4 rounded-[5px] p-5 shadow">
              <div className="text-[18px] font-bold pb-5">Lịch Trình Tour</div>
              <div>
                <Collapse
                  bordered={false}
                  defaultActiveKey={['0']}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  style={{
                    background: token.colorBgContainer,
                    fontSize: '14px',
                  }}
                  items={items}
                />
              </div>
            </div>
            <div className="bg-white mt-4 rounded-[5px] p-5 shadow">
              <div className="text-[18px] font-bold ">Thông tin cần lưu ý</div>
              <div>
                <Tabs defaultActiveKey="1" items={itemss} />
              </div>
            </div>
          </div>

          <div className="w-1/3 max-h-[calc(100vh-40px)] flex justify-center sticky top-7 z-50 mb-2">
            <div className="bg-amber-50 w-93 h-147 rounded-xl p-6 flex flex-col justify-between mb-5 border-1 border-gray-200 shadow">
              <p className="text-[21px] text-blue-800 font-bold ">
                Lịch Trình và Giá Tour
              </p>
              <div className="w-full border-1 border-gray-300"></div>
              <p className="text-[14px] text-gray-500 font-medium">
                Chọn Lịch Trình và Xem Giá:
              </p>
              <div className="flex mr-10 h-12 items-center border-1 border-gray-300 w-50 rounded-xl">
                <div className="flex items-center justify-center px-3 mt-2">
                  <CalendarOutlined className="text-gray-500 text-[14px] mb-2" />
                </div>
                <div className="flex flex-col items-center ">
                  <DatePicker
                    placeholder="Chọn ngày"
                    format="DD.MM.YYYY"
                    className="border-none text-lg"
                  />
                </div>
              </div>
              <div className="bg-white h-15 rounded-xl flex justify-between p-5 items-center text-center border-1 border-gray-300">
                <div className="text-center">
                  <p className="text-center text-[14px] font-medium">
                    Người lớn <br />{' '}
                  </p>
                  <div className="text-[10px] text-gray-700">&gt; 10 tuổi </div>
                </div>
                <p className="text-black text-[14px] font-medium">
                  x 10.990.000
                </p>
                <div className="flex justify-between w-16 text-[13px] font-medium">
                  <MinusOutlined className="cursor-pointer" />
                  <p>1</p>
                  <PlusOutlined className="cursor-pointer" />
                </div>
              </div>
              <div className="bg-white border-1 border-gray-300 text-center h-15 rounded-xl flex justify-between p-5 items-center">
                <div className="text-center">
                  <p className="text-center text-[14px] font-medium">
                    Trẻ em <br />{' '}
                  </p>
                  <div className="text-[10px] text-gray-700">2 - 10 tuổi </div>
                </div>
                <p className="text-black text-[14px] font-medium">
                  x 10.990.000
                </p>
                <div className="flex justify-between w-16 text-[13px] font-medium">
                  <MinusOutlined className="cursor-pointer" />
                  <p>1</p>
                  <PlusOutlined className="cursor-pointer" />
                </div>
              </div>
              <div className="bg-white border-1 border-gray-300 text-center h-15 rounded-xl flex justify-between p-5 items-center">
                <div className="text-center">
                  <p className="text-center text-[14px] font-medium">
                    Trẻ nhỏ <br />{' '}
                  </p>
                  <div className="text-[10px] text-gray-700">&lt; 2 tuổi </div>
                </div>
                <p className="text-black text-[14px] font-medium">
                  x 10.990.000
                </p>
                <div className="flex justify-between w-16 text-[13px] font-medium">
                  <MinusOutlined className="cursor-pointer" />
                  <p>1</p>
                  <PlusOutlined className="cursor-pointer" />
                </div>
              </div>
              <div>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button icon={<TagOutlined />} className="flex items-center">
                    <p className="text-[12px]">Chọn Ưu Đãi</p>
                  </Button>
                </Dropdown>
              </div>
              <div className="flex justify-between">
                <p className="text-[14px] font-medium">Giảm giá ưu đãi</p>
                <div className="flex flex-row items-end">
                  <p className="text-[14px] font-medium text-gray-600">
                    -900.000
                  </p>
                  <p className="text-[12px] pl-2 font-medium text-gray-600">
                    VND
                  </p>
                </div>
              </div>
              <div className="flex justify-between ">
                <p className="text-[14px] font-medium">Tổng Giá Tour</p>
                <div className="flex flex-row items-end">
                  <p className="text-[14px] font-medium text-gray-600">
                    14.990.000
                  </p>
                  <p className="text-[12px] pl-2 font-medium text-gray-600">
                    VND
                  </p>
                </div>
              </div>
              <div className="w-full border-b-gray-50 border-1"></div>
              <div className="flex justify-between">
                <p className="text-[16px] font-medium">Tổng Thanh Toán</p>
                <div className="flex flex-row items-end">
                  <p className="text-[17px] font-bold text-red-700">
                    14.990.000
                  </p>
                  <p className="text-[10px] pl-2 font-medium text-red-700">
                    VND
                  </p>
                </div>
              </div>
              <div className="flex items-center text-red-500 font-semibold">
            {/* <GiftOutlined className="mr-2" />
            <span>Ưu đãi: Giảm 10% cho nhóm 5 người</span> */}
          </div>
              <div>
                <Button
                  type="primary"
                  style={{
                    width: '100%',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 12,
                    backgroundColor: '#009EE2',
                  }}
                  onClick={() => navigate('/tour-booking')}
                  >
                  Đặt Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <footer className="bg-gray-900 text-white text-center p-4">
          <p>&copy; 2025 Travelista Tours. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
