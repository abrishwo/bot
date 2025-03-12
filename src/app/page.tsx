'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getLotteries } from '@/features/lotteries/lotteriesSlice';
import LotteryCard from '@/components/LotteryCard';
import BuyTicketModal from '@/components/BuyTicketModal';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: lotteries, loading, error } = useAppSelector((state) => state.lotteries);

  const [selectedLottery, setSelectedLottery] = useState(null);

  useEffect(() => {
    dispatch(getLotteries());
  }, [dispatch]);

  const handleCardClick = (lottery: any) => {
    setSelectedLottery(lottery);
  };

  const closeModal = () => {
    setSelectedLottery(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Active Lotteries</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error as string}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lotteries.map((lottery: any) => (
          <LotteryCard
            key={lottery.id}
            title={lottery.title}
            description={lottery.description}
            imageUrl={lottery.imageUrl}
            price={lottery.price}
            drawDate={lottery.drawDate.toDate?.() || lottery.drawDate}
            onClick={() => handleCardClick(lottery)}
          />
        ))}
      </div>

      {selectedLottery && (
        <BuyTicketModal lottery={selectedLottery} onClose={closeModal} />
      )}
    </div>
  );
}
