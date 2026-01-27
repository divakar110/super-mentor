require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!GEMINI_API_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.error("Error: Missing environment variables. Check .env file.");
    process.exit(1);
}

// Initialize Clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

async function generateAdCopy(idea) {
    console.log(`\n🤖 Generating ad copy for: "${idea}"...`);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
        You are an expert marketing copywriter. 
        Create a short, engaging, and high-converting telegram ad post based on this idea: "${idea}".
        
        Guidelines:
        - Keep it punchy and concise (under 200 words).
        - Use emojis to make it visually appealing.
        - Include a clear Call to Action (CTA).
        - Add 3-5 relevant hashtags at the bottom.
        - Do not include any introductory text like "Here is the ad", just give me the ad content.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Error:", error.message);
        return null;
    }
}

async function postToTelegram(content) {
    console.log("\n🚀 Posting to Telegram...");
    try {
        await bot.sendMessage(TELEGRAM_CHANNEL_ID, content, { parse_mode: 'Markdown' });
        console.log("✅ Successfully posted to Telegram!");
    } catch (error) {
        console.error("Telegram Error:", error.message);
    }
}

function getNextOptimalTime() {
    // Simple logic: Post at next peak hour (9 AM, 1 PM, or 6 PM)
    const now = new Date();
    const peakHours = [9, 13, 18];

    let nextTime = new Date(now);
    let found = false;

    for (let hour of peakHours) {
        nextTime.setHours(hour, 0, 0, 0);
        if (nextTime > now) {
            found = true;
            break;
        }
    }

    // If all peak hours passed today, schedule for 9 AM tomorrow
    if (!found) {
        nextTime.setDate(now.getDate() + 1);
        nextTime.setHours(peakHours[0], 0, 0, 0);
    }

    return nextTime;
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const input = args.slice(1).join(" ");

    if (!command) {
        console.log(`
Usage:
  node index.js "Your Idea"       -> Generate and schedule post
  node index.js --test-gen "Idea" -> Test content generation only
  node index.js --test-post "Msg" -> Test Telegram posting only
        `);
        return;
    }

    if (command === '--test-gen') {
        if (!input) return console.error("Please provide an idea.");
        const ad = await generateAdCopy(input);
        console.log("\n--- Generated Content ---\n");
        console.log(ad);
        console.log("\n-------------------------\n");
    }
    else if (command === '--test-post') {
        if (!input) return console.error("Please provide a message.");
        await postToTelegram(input);
    }
    else {
        // Default Flow: Generate -> Schedule -> Post
        // Note: For this first version, we'll treat the first argument as the idea
        const idea = [command, ...args.slice(1)].join(" ");
        const ad = await generateAdCopy(idea);

        if (ad) {
            console.log("\n--- Preview ---\n");
            console.log(ad);
            console.log("\n----------------\n");

            // For immediate testing, we can ask user or just schedule
            // For automation, let's look for a --schedule flag in future, 
            // but for now, let's just simulate the scheduling logic

            const scheduleTime = getNextOptimalTime();
            console.log(`\n⏳ Validated time logic: Next peak slot is ${scheduleTime.toLocaleString()}`);

            // In a real server script, we would use:
            // schedule.scheduleJob(scheduleTime, () => postToTelegram(ad));
            // console.log("Job scheduled. Keep this script running...");

            // For CLI usage/demo, posting immediately to show it works is often better,
            // or we post now. Let's post now for the user to see results instantly.
            await postToTelegram(ad);
        }
    }
}

main();
