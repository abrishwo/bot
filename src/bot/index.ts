import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const app = express();
const PORT = process.env.TELEGRAM_BOT_PORT || 3001;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const message = req.body.message;

  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const text = message.text;

  // Example: /start <userId>
  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const userId = parts[1]; // This is from deep link

    if (!userId) {
      await sendTelegramMessage(chatId, '❗ Missing user ID.');
      return res.sendStatus(200);
    }

    try {
      // Save chatId for the user in Firestore
      await db.collection('users').doc(userId).set(
        {
          telegramChatId: chatId
        },
        { merge: true }
      );

      await sendTelegramMessage(
        chatId,
        `✅ Registration complete! You'll now receive lottery notifications.`
      );
    } catch (error) {
      console.error('Error saving chat ID:', error);
    }
  }

  res.sendStatus(200);
});

// Send a message utility
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const sendTelegramMessage = async (chatId: number, message: string) => {
  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });
};

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Telegram Bot webhook listening on port ${PORT}`);
});
