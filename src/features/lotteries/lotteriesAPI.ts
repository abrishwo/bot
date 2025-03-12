import { db } from '@/lib/firebase'; // Import your Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore';

export const fetchActiveLotteries = async (): Promise<any[]> => {
  try {
    const lotteriesRef = collection(db, 'lotteries'); // Get the Firestore collection
    const q = query(lotteriesRef, where('active', '==', true)); // Query active lotteries
    const querySnapshot = await getDocs(q); // Execute the query
    const lotteries: any[] = [];

    querySnapshot.forEach((doc) => {
      lotteries.push({
        id: doc.id,
        ...doc.data(),
      } ); // Push each lottery document into the array
    });

    return lotteries; // Return the array of active lotteries
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    throw new Error('Failed to fetch lotteries'); // Throw an error if the fetch fails
  }
};
