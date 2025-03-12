import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

export async function POST(req: NextRequest) {
  const { lotteryId } = await req.json();

  if (!lotteryId) {
    return NextResponse.json({ error: 'Missing lottery ID' }, { status: 400 });
  }

  try {
    const lotteryRef = db.collection('lotteries').doc(lotteryId);
    const lotterySnap = await lotteryRef.get();

    if (!lotterySnap.exists) {
      return NextResponse.json({ error: 'Lottery not found' }, { status: 404 });
    }

    const lotteryData = lotterySnap.data();
    const ticketsSnap = await db
      .collection('tickets')
      .where('lotteryId', '==', lotteryId)
      .where('status', '==', 'paid')
      .get();

    if (ticketsSnap.empty) {
      return NextResponse.json({ error: 'No tickets purchased' }, { status: 400 });
    }

    const tickets = ticketsSnap.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      ...doc.data()
    }));

    // Random Winner Selection
    const winnerIndex = Math.floor(Math.random() * tickets.length);
    const winnerTicket = tickets[winnerIndex];

    // Update lottery with winner info
    await lotteryRef.update({
      winnerTicketId: winnerTicket.id,
      winnerUserId: winnerTicket.userId??'',
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Save draw results to "draws" collection (optional)
    await db.collection('draws').add({
      lotteryId,
      winnerTicketId: winnerTicket.id,
      winnerUserId: winnerTicket.userId,
      drawnAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Notify winner via Telegram
    await notifyWinnerTelegram(winnerTicket.userId, lotteryData?.title);

    return NextResponse.json({
      message: '🎉 Draw completed',
      winnerTicket
    });
  } catch (error) {
    console.error('Draw Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// Notify winner via Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function notifyWinnerTelegram(userId: string, lotteryTitle: string) {
  const userSnap = await db.collection('users').doc(userId).get();
  const user = userSnap.data();

  if (!user?.telegramChatId) {
    console.log(`User ${userId} has no Telegram linked`);
    return;
  }

  const message = `🎉 Congratulations!\nYou won the "${lotteryTitle}" lottery!\n\nWe'll contact you soon.`;

  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: user.telegramChatId,
      text: message
    })
  });

  console.log(`Winner notified via Telegram (userId: ${userId})`);
}
