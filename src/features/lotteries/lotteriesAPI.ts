import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const fetchActiveLotteries = async () => {
  try {
    const q = query(collection(db, 'lotteries'), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);

    const lotteries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return lotteries;
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    throw error;
  }
};
