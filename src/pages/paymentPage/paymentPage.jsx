import React, { useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { CreditCardOutlined, PayCircleOutlined, WalletOutlined } from '@ant-design/icons';

const PaymentPage = ({ tourDetails, totalPrice }) => {
    const paymentDetails = JSON.parse(localStorage.getItem('tourDetails'));

console.log(paymentDetails); // {tourId, adults, children, infants, totalPrice, fullName, phoneNumber, email, notes}

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

//   const handlePayment = () => {
//     setLoading(true);
//     // Giả sử xử lý thanh toán ở đây
//     setTimeout(() => {
//       message.success('Thanh toán thành công!');
//       setIsModalVisible(true);
//       setLoading(false);
//     }, 2000);
//   };

  return (
    <div className="container mx-auto p-4 h-screen w-screen">
      <h2 className="text-xl font-semibold mb-4">Trang Thanh Toán</h2>

      {/* Thông tin tour */}
      <div className="border-b mb-4">
        <h3 className="font-medium text-lg text-gray-700">Thông tin tour</h3>
        {/* <p>{tourDetails.name}</p> */}
        {/* <p>{tourDetails.startDate ? dayjs(tourDetails.startDate).format('DD/MM/YYYY') : 'Chưa có ngày khởi hành'}</p> */}
        {/* <p><strong>Tổng giá:</strong> {totalPrice.toLocaleString('vi-VN')} đ</p> */}
      </div>

      {/* Thông tin khách hàng */}
      {/* <Form layout="vertical">
        <h3 className="font-medium text-lg text-gray-700 mb-3">Thông tin khách hàng</h3>
        <Form.Item label="Họ và Tên" required>
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item label="Số điện thoại" required>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Email" required>
          <Input type="email" placeholder="Nhập email" />
        </Form.Item>
      </Form> */}

      {/* Phương thức thanh toán */}
      {/* <h3 className="font-medium text-lg text-gray-700 mt-4 mb-3">Chọn phương thức thanh toán</h3> */}
      {/* <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
        <Radio value="creditCard">
          <CreditCardOutlined /> Thẻ tín dụng/ghi nợ
        </Radio>
        <Radio value="paypal">
          <PayCircleOutlined /> PayPal
        </Radio>
        <Radio value="bankTransfer">
          <WalletOutlined /> Chuyển khoản ngân hàng
        </Radio>
      </Radio.Group> */}

      {/* Hiển thị thêm thông tin nếu chọn thẻ tín dụng */}
      {/* {paymentMethod === 'creditCard' && (
        <div className="mt-4">
          <Form layout="vertical">
            <Form.Item label="Số thẻ" required>
              <Input placeholder="Nhập số thẻ" />
            </Form.Item>
            <Form.Item label="Ngày hết hạn" required>
              <Input placeholder="MM/YY" />
            </Form.Item>
            <Form.Item label="Mã CVV" required>
              <Input placeholder="Nhập mã CVV" />
            </Form.Item>
          </Form>
        </div>
      )} */}

      {/* Hiển thị thêm thông tin nếu chọn PayPal  */}
      {/* {paymentMethod === 'paypal' && (
        <div className="mt-4">
          <Form.Item label="Email PayPal" required>
            <Input placeholder="Nhập email PayPal" />
          </Form.Item>
        </div>
      )}

      {/* Nút thanh toán */}
      {/* <div className="mt-4">
        <Button type="primary" size="large" block loading={loading} onClick={handlePayment}>
          Thanh toán
        </Button>
      </div> */}

      {/* Modal thanh toán thành công */}
      {/* <Modal
        title="Thanh toán thành công!"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <p>Cảm ơn bạn đã đặt tour! Bạn sẽ nhận được thông tin qua email.</p>
      </Modal> */}
    </div>
  );
};

export default PaymentPage;
