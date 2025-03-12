const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export const sendTelegramMessage = async (chatId: string, message: string) => {
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const data = await res.json();

    if (!data.ok) {
      console.error('Telegram Error:', data);
    }

    return data;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
};
