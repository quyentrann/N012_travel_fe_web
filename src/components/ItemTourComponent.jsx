import React from 'react';
import card from '../images/card.jpg';
import { EnvironmentOutlined } from '@ant-design/icons';
export default function ItemTourComponent() {
  return (
    <div className="bg-amber-50 h-125 w-105  rounded-3xl cursor-pointer hover:scale-101 my-7">
      <div className="">
        <img src={card} alt="Travel" className="h-75 w-full" />
      </div>
      <div className="px-6 pt-2 flex flex-col flex-1 justify-between h-40">
        <p className="text-[25px] font-medium">
          Điệp Sơn - Con đường giữa biển
        </p>
        <p className="text-[18px] pr-10">
          Khám phá những bãi biển đẹp, đảo hoang sơ và lặn ngắm san hô.
        </p>

        <div className="flex justify-between text-[20px]">
          <div className="flex ">
            <EnvironmentOutlined />
            <p className="pl-1 text-[]"> Vũng Tàu</p>
          </div>
          <p> 4500000.0 đ/người</p>
        </div>
      </div>
    </div>
  );
}
