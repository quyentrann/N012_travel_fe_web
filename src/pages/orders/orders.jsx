import { Table, Tag, Button, Avatar } from "antd";
import React, { useEffect, useState, useRef } from 'react';
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios"

const ordersData = [
  {
    key: "1",
    tourImage: "https://via.placeholder.com/80",
    tourName: "Tour Đà Nẵng - Hội An",
    bookingDate: "20/03/2025",
    status: "Đã xác nhận",
    price: "3.500.000đ",
  },
  {
    key: "2",
    tourImage: "https://via.placeholder.com/80",
    tourName: "Tour Sapa - Fansipan",
    bookingDate: "18/03/2025",
    status: "Đang chờ",
    price: "4.200.000đ",
  },
  {
    key: "3",
    tourImage: "https://via.placeholder.com/80",
    tourName: "Tour Phú Quốc",
    bookingDate: "10/03/2025",
    status: "Đã hủy",
    price: "5.000.000đ",
  },
];

// const statusColors = {
//   "Đã xác nhận": "green",
//   "Đang chờ": "gold",
//   "Đã hủy": "red",
// };

const statusColors = {
  CONFIRMED: "green",
  PENDING: "gold",
  CANCELED: "red",
};

const Orders = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("TOKEN"); // Nếu cần token
        const response = await axios.get("http://localhost:8080/api/bookings/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData = response.data.map((item) => ({
          key: item.bookingId,
          tourImage: item.tourImage || "https://via.placeholder.com/80",
          tourName: item.tourName || "Tour không xác định",
          bookingDate: item.bookingDate,
          status: item.status || "PENDING",
          price: item.totalPrice.toLocaleString() + "đ",
          numberPeople: item.numberPeople,
        }));

        setHistory(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);



  const columns = [
    {
      title: "Tour",
      dataIndex: "tourImage",
      key: "tourImage",
      render: (text) => <Avatar shape="square" size={64} src={text} />,
    },
    {
      title: "Tên Tour",
      dataIndex: "tourName",
      key: "tourName",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Giá Tiền",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-semibold">{price}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "numberPeople",
      key: "numberPeople",
      render: (numberPeople) => <span className="font-semibold">{numberPeople}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Button type="primary" icon={<EyeOutlined />}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="w-screen mx-auto p-6 bg-white shadow-md rounded-lg h-screen">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Danh Sách Tour Đã Đặt</h2>
      {/* <Table columns={columns} dataSource={ordersData} pagination={{ pageSize: 5 }} /> */}
      <Table columns={columns} dataSource={history} loading={loading} pagination={{ pageSize: 5 }} />
      
    </div>
  );
};

export default Orders;