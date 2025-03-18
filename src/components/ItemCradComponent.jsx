import React from "react";
import card from '../images/card.jpg';
export default function ItemCradComponent() {
  return <div className="bg-amber-100 h-72 w-55  rounded-2xl cursor-pointer hover:scale-101">
     <div className="flex justify-center pt-4">
     <img src={card} alt="Travel" className="h-37 w-45 rounded-xl" />
     </div>
     <div className="px-6 pt-2">
     <p className="text-[20px] font-medium">Côn Đảo, Bà Rịa - Vũng Tàu</p>
     </div>
     <div className="flex pt-1 px-6 text-[18px] font-bold ">
        <p> 4500000.0đ/người</p>
     </div>
  </div>;
}