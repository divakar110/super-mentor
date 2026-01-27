require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token || token === 'your_telegram_bot_token_here') {
    console.error("❌ Error: Please paste your BOT_TOKEN in the .env file first!");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is listening...");
console.log("👉 Action Required: Go to your Channel/Group and type a message (e.g., 'test').");

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const type = msg.chat.type;
    const title = msg.chat.title || msg.chat.username || "Private Chat";

    console.log(`\n✅ Found Chat ID!`);
    console.log(`Title: ${title}`);
    console.log(`Type: ${type}`);
    console.log(`ID: ${chatId}`);
    console.log(`\nCopy this ID (${chatId}) and paste it into your .env file as TELEGRAM_CHANNEL_ID.`);

    // Stop after finding one
    process.exit(0);
});

bot.on('channel_post', (msg) => {
    const chatId = msg.chat.id;
    const title = msg.chat.title;

    console.log(`\n✅ Found Channel ID!`);
    console.log(`Channel: ${title}`);
    console.log(`ID: ${chatId}`);
    console.log(`\nCopy this ID (${chatId}) and paste it into your .env file as TELEGRAM_CHANNEL_ID.`);

    process.exit(0);
});
