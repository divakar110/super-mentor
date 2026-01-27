require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const TelegramBot = require('node-telegram-bot-api');
const { YoutubeTranscript } = require('youtube-transcript');

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

async function getTranscript(url) {
    console.log(`\n📺 Fetching transcript for: ${url}...`);
    try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(url);
        // Combine all text parts
        return transcriptItems.map(item => item.text).join(' ');
    } catch (error) {
        console.error("Transcript Error:", error.message);
        return null;
    }
}

async function repurposeContent(transcript) {
    console.log("\n🧠 Asking Gemini to summarize and repurpose...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use Flash for longer context text

        // Truncate if insanely long (Gemini 1.5 handles 1M tokens, but let's be safe for API limits)
        const safeTranscript = transcript.substring(0, 50000);

        const prompt = `
        You are an expert social media manager.
        Read the following YouTube video transcript and create a high-value Telegram post.
        
        Transcript: 
        "${safeTranscript}..."

        Guidelines:
        - Format: "Title (Bold) \n\n Key Takeaways (Bulleted) \n\n Outstanding Insight (Italic)"
        - Tone: Professional, Insightful, yet casual enough for Telegram.
        - Ends with: "Watch full video: [I will add link manually]" and 3 relevant hashtags.
        - Keep it under 250 words total.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Error:", error.message);
        return null;
    }
}

async function postToTelegram(content, videoUrl) {
    console.log("\n🚀 Posting to Telegram...");
    try {
        const finalContent = `${content}\n\n[Watch Video](${videoUrl})`;
        await bot.sendMessage(TELEGRAM_CHANNEL_ID, finalContent, { parse_mode: 'Markdown' });
        console.log("✅ Successfully posted to Telegram!");
    } catch (error) {
        console.error("Telegram Error:", error.message);
    }
}

async function main() {
    const videoUrl = process.argv[2];

    if (!videoUrl) {
        console.log(`
Usage:
  node index.js <YOUTUBE_URL>
        `);
        return;
    }

    // 1. Get Transcript
    const transcript = await getTranscript(videoUrl);
    if (!transcript) {
        console.log("❌ Could not get transcript. Video might not have captions enabled.");
        return;
    }
    console.log(`✅ Transcript fetched (${transcript.length} chars).`);

    // 2. Generate Content
    const postContent = await repurposeContent(transcript);
    if (!postContent) return;

    console.log("\n--- Generated Post ---\n");
    console.log(postContent);
    console.log("\n----------------------\n");

    // 3. Post (Optional confirm logic could go here, but automating for now)
    await postToTelegram(postContent, videoUrl);
}

main();
