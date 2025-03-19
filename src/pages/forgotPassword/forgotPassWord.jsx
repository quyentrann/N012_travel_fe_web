import React from 'react';
import { Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import nen from '../../images/nen.webp';
import logo from '../../images/logo.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';
import plan from '../../images/maybay.png';

export default function ForgotPassword() {
  const handleResetPassword = () => {
    message.success('Password reset link has been sent to your email!');
  };

  return (
    <div
      className="h-screen w-screen flex "
      style={{
        backgroundImage: `url(${nen})`,
      }}>
      <div className="left-0 top-0 w-1/2 h-full flex flex-col text-white pt-6">
        <img
          src={logo}
          alt="Travel"
          className="w-1/4 max-w-xs md:max-w-md lg:max-w-lg object-contain"
          style={{ height: 80 }}
        />

        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2 "
          style={{ color: 'black', fontSize: '65px' }}>
          Travelista Tours
        </h1>
        <p
          style={{ color: 'black', fontSize: 20 }}
          className="mt-1 font-normal ml-25 mr-5">
          Every journey begins with a single step – embark on an unforgettable
          adventure with us, where breathtaking landscapes, rich cultures, and
          extraordinary experiences await at every turn!
        </p>
      </div>
      <div
        className="left-0 top-0 w-1/2 h-full flex flex-col text-white p-5 bg-white "
        style={{ clipPath: 'ellipse(120% 80% at 100% 50%)' }}>
            <div className="flex justify-end">
                    <img
                      src={plan}
                      alt="plan"
                      className="w-1/2 object-contain pt-2"
                      style={{ height: 70 }}
                    />
                  </div>
        <div className="justify-center flex flex-col items-center">
        <h1
            className="text-4xl font-bold"
            style={{ fontSize: 75, color: '#009EE2' }}>
            Welcome
          </h1>
          <p className="text-gray-500 mb-6" style={{ fontSize: 25 }}>
          Forgot Password
          </p>
          <div className="w-full max-w-md" style={{ width: 400 }}>
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined />}
              className="mb-4"
            />
            <Button
              type="primary"
              onClick={handleResetPassword}
              style={{
                width: '100%',
                height: 50,
                fontSize: 20,
                fontWeight: 500,
                borderRadius: 12,
                backgroundColor: '#009EE2',
              }}>
              Send
            </Button>
            <div className="text-center mt-4">
              <Link style={{ color: '#009EE2', fontSize: 16 }} to="/login">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, alignItems: 'end', display: 'flex' }}>
          <div>
            <img src={vt1} alt="vt1" style={{ height: 170 }} />
          </div>
          <div style={{ justifyContent: 'end', display: 'flex', flex: 1 }}>
            <img src={vt2} alt="vt2" style={{ height: 170 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
