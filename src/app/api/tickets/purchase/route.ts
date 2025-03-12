import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    const { userId, lotteryId, ticketCount = 1, paymentId } = await req.json();

    if (!userId || !lotteryId || !paymentId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // TODO: Verify payment with PayPal or Telegram Payment validation (for MVP, assume it's valid)

    const batch = db.batch();
    const ticketsRef = db.collection('tickets');

    for (let i = 0; i < ticketCount; i++) {
      const ticketDoc = ticketsRef.doc();
      batch.set(ticketDoc, {
        id: ticketDoc.id,
        userId,
        lotteryId,
        paymentId,
        status: 'paid',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();

    return NextResponse.json({
      message: `${ticketCount} ticket(s) purchased successfully`
    });
  } catch (error) {
    console.error('Ticket purchase error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
