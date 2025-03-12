'use client';

import { useState } from 'react';

interface Props {
  lotteryId: string;
  userId: string; // From Redux or Auth context
}

const TicketPurchase = ({ lotteryId, userId }: Props) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);

    try {
      // 1. Simulate Payment (In production, integrate PayPal or Telegram)
      const paymentId = 'fake-payment-id-' + Date.now();

      const res = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lotteryId,
          ticketCount,
          paymentId
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${ticketCount} Ticket(s) Purchased!`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Server error during purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 shadow-md">
      <h3 className="text-xl font-bold mb-2">🎟️ Buy Tickets</h3>

      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setTicketCount(Math.max(ticketCount - 1, 1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          ➖
        </button>
        <span className="font-semibold">{ticketCount}</span>
        <button
          onClick={() => setTicketCount(ticketCount + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          ➕
        </button>
      </div>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : `Buy ${ticketCount} Ticket(s)`}
      </button>
    </div>
  );
};

export default TicketPurchase;
