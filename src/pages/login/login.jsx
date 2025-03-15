import React from 'react';
import { Input, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { Button } from 'antd';

import nen from '../../images/nen.webp';
import nen2 from '../../images/nen2.webp';
import logo from '../../images/logo.png';
import plan from '../../images/maybay.png';
import gg from '../../images/Google.png';
import fb from '../../images/fb.png';
import ap from '../../images/apple.png';
import vt1 from '../../images/Vector.png';
import vt2 from '../../images/Group688.png';
export default function Login() {
  const navigate = useNavigate();
  
  const gotoHome =()=>{
    navigate('/')
  }
  return (
    <div
      className="h-screen w-screen flex "
      style={{
        backgroundImage: `url(${nen})`,
      }}>
      <div className="w-1/2 h-full flex flex-col pt-6">
        <img src={logo} alt="Travel" className="w-1/4 object-contain h-17" />

        <h1
          className="text-5xl font-extrabold italic font-serif pl-25 pt-2 "
          style={{ color: 'black', fontSize: '65px' }}>
          Travelista Tours
        </h1>
        <p className="mt-1 ml-25 mr-5 text-xl text-black font-normal">
          Every journey begins with a single step – embark on an unforgettable
          adventure with us, where breathtaking landscapes, rich cultures, and
          extraordinary experiences await at every turn!
        </p>
      </div>
      <div
        className=" w-1/2 h-full flex flex-col p-5 bg-white "
        style={{ clipPath: 'ellipse(120% 80% at 102% 50%)' }}>
        <div className="flex justify-end">
          <img
            src={plan}
            alt="plan"
            className="w-1/2 object-contain pt-2 h-20"
          />
        </div>
        <div className="justify-center flex flex-col items-center">
          <div className="text-[75px] font-bold text-[#009EE2]">Welcome</div>
          <p className="text-gray-500 mb-6 text-[27px]">Login with Email</p>
          <div className="w-full max-w-md" style={{ width: 400 }}>
            <Input
              size="large"
              placeholder="Enter your email"
              prefix={<MailOutlined className="text-gray-500 pr-2" />}
              className="w-full h-14 border border-gray-400 rounded-lg focus:border-blue-400"
              style={{ borderColor: '#4A90E2', fontSize: 18 }}
            />

            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<LockOutlined className="text-gray-500 pr-2" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="w-full h-14 border border-gray-400 rounded-lg focus:border-blue-400 mt-5"
              style={{ borderColor: '#4A90E2', fontSize: 18 }}
            />
            <div
              className="text-right text-sm text-blue-500 pt-2 pb-4"
              style={{ fontSize: 15 }}>
              <span className="text-[#009EE2] inline cursor-pointer font-[500]"  onClick={() => navigate('/forgot-password')}>
                Forgot your password?
              </span>
            </div>

            <div>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  height: 50,
                  fontSize: 22,
                  fontWeight: 500,
                  borderRadius: 12,
                  backgroundColor: '#009EE2',
                }} 
                onClick={gotoHome}
                >
                Login
              </Button>
            </div>
          </div>

          <div className="my-5 flex items-center w-full justify-center">
            <span className="mx-4 text-gray-500">OR</span>
          </div>

          <div className="flex space-x-5 ">
            <div>
              <button className="bg-[#E7F2F5] w-[110px] h-[60px] flex justify-center items-center flex-1">
                <img src={gg} alt="gg" className="h-6" />
              </button>
            </div>

            <div>
              <button className="bg-[#E7F2F5] w-[110px] h-[60px] flex justify-center items-center flex-1">
                <img src={fb} alt="fb" className="h-7" />
              </button>
            </div>
            <div>
              <button className="bg-[#E7F2F5] w-[110px] h-[60px] flex justify-center items-center flex-1">
                <img src={ap} alt="ap" className="h-7" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-gray-700 pt-4" style={{ fontSize: 20 }}>
            Don't have an account?{' '}
            <div className=" cursor-pointer inline text-[#009EE2] transition duration-200"  onClick={() => navigate('/register')}>
              Register Now
            </div>
          </div>
        </div>
        <div 
        className='flex-1 items-end flex'>
          <div>
            <img
              src={vt1}
              alt="vt1"
              className="h-[170px] pl-[30px] pb-[40px] rotate-8"
            />
          </div>
          <div 
          className='h-[170] justify-end flex flex-1 pr-5'>
            <img src={vt2} alt="vt2" />
          </div>
        </div>
      </div>
    </div>
  );
}
