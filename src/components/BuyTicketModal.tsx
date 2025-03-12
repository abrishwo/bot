'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

import { sendTelegramMessage } from '@/lib/telegram';



interface BuyTicketModalProps {
  lottery: any;
  onClose: () => void;
}

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({ lottery, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (orderId: string) => {
    setIsProcessing(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
  
      const chatId = userData?.telegramChatId;
  
      // Save ticket
      const ticketRef = await addDoc(collection(db, 'tickets'), {
        lotteryId: lottery.id,
        orderId,
        userId: currentUser.uid,
        purchasedAt: Timestamp.now(),
        status: 'paid'
      });
  
      // Send Telegram notification
      if (chatId) {
        await sendTelegramMessage(
          chatId,
          `🎟️ You successfully purchased a ticket for "${lottery.title}"!\n\nTicket ID: ${ticketRef.id}`
        );
      }
  
      alert('Ticket Purchased Successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Error saving ticket');
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">{lottery.title}</h2>
        <p>Price: ${lottery.price}</p>

        <div className="mt-4">
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: lottery.price.toString(),
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order?.capture();
              const orderId = details?.id;
              if (orderId) {
                await handleApprove(orderId);
              }
            }}
            onError={(err) => {
              console.error('PayPal Error:', err);
              alert('Payment Error!');
            }}
          />
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
          disabled={isProcessing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyTicketModal;
