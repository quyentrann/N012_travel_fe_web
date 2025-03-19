import React from 'react';
import { Input,  Button, Checkbox, message } from 'antd';
import { MailOutlined,UserOutlined ,LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import nen from '../../images/nen.webp';
import nen2 from '../../images/nen2.webp';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import gg from '../../images/Google.png';
import fb from '../../images/fb.png';
import ap from '../../images/apple.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';
export default function Register() {

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
          Create an Account
          </p>
          <div className="w-full max-w-md" style={{ width: 400 }}>
          <Input
          size="large"
          placeholder="Full Name"
          prefix={<UserOutlined />}
          className="w-full h-14 border border-gray-400 rounded-lg focus:border-blue-400"
          style={{ borderColor: '#4A90E2', fontSize: 18 }}
        />
        <Input
          size="large"
          placeholder="Enter your email"
          prefix={<MailOutlined />}
          className="w-full h-14 border border-gray-400 rounded-lg focus:border-blue-400 mt-5"
          style={{ borderColor: '#4A90E2', fontSize: 18 }}
        />
        <Input.Password
          size="large"
          placeholder="Enter your password"
          prefix={<LockOutlined />}
          className="w-full h-14 border border-gray-400 rounded-lg focus:border-blue-400 mt-5"
          style={{ borderColor: '#4A90E2', fontSize: 18 }}
        />
        <Input.Password
          size="large"
          placeholder="Confirm your password"
          prefix={<LockOutlined />}
          className="w-full h-14 border border-gray-400 rounded-lg focus:border-blue-400 mt-5"
          style={{ borderColor: '#4A90E2', fontSize: 18 }}
        />
      <Checkbox >
          I agree to the <Link to="/terms" className="text-blue-500">Terms & Conditions</Link>
        </Checkbox>
           
            <div>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  height: 50,
                  fontSize: 22,
                  fontWeight: 500,
                  borderRadius: 12,
                  backgroundColor: '#009EE2', marginTop:18
                }}>
                Register
              </Button>
            </div>
            <div
              className="text-right text-sm text-blue-500 cursor-pointer pt-2 pb-4"
              style={{ fontSize: 15 }}>
              <Link style={{ color: '#009EE2' }} to="/login">
              Already have an account?
              </Link>
            </div>
          </div>

        </div>
        <div style={{ flex: 1, alignItems: 'end', display: 'flex' }}>
          <div style={{}}>
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
