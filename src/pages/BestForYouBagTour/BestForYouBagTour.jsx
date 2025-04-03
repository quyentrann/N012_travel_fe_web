import React, { useEffect, useState } from 'react';
import ItemBagTourBestForYou from '../../components/ItemBagTourBestForYou';
import { getTours } from '../../apis/tour';

function BestForYouBagTour() {
  const [tours, setTours] = useState([]);
  const visibleCount = 6; // Số lượng tour hiển thị

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

  return (
    <div className="w-full flex justify-center p-14 ">
      <div className="flex flex-col items-center gap-6 p-6 max-w-[1500px]">
        {tours.slice(0, visibleCount).map((tour) => (
          <ItemBagTourBestForYou key={tour.tourId} tour={tour} />
        ))}
      </div>
    </div>
  );
  
  
  
}

export default BestForYouBagTour;
