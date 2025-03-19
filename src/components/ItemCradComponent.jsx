import React from "react";
import card from "../images/card.jpg";
import { StarFilled } from "@ant-design/icons";

export default function ItemCradComponent() {
  return (
    <div className="bg-amber-100 h-55 w-40 rounded-[8px] cursor-pointer hover:scale-101 p-2">
      <div className="flex justify-center">
        <img src={card} alt="Travel" className="h-27 w-35 rounded-[3px]" />
      </div>

      <div className="pt-2 px-1">
        <p className="text-[12px] font-medium">Côn Đảo, Bà Rịa - Vũng Tàu</p>
      </div>

      <div className="flex pt-1 px-1 text-[14px] font-bold text-red-600">
        <p>4.500.000đ/người</p>
      </div>

      <div className="flex items-center justify-between px-1 pt-1 text-[12px] text-gray-600">
        <div className="flex items-center text-yellow-500">
          <StarFilled className="text-gray-300" /> 
          <span className="text-gray-600 ml-1">4.5</span>
        </div>
        <p>120 đã đặt</p>
      </div>
    </div>
  );
}
