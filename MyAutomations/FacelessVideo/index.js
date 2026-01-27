require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { generateScript } = require('./modules/script');
const { generateAudio } = require('./modules/audio');
const { fetchVisual } = require('./modules/visuals');
const { assembleVideo } = require('./modules/render');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const TOPIC = process.argv[2];
if (!TOPIC) {
    console.log("Usage: node index.js \"The History of Coffee\"");
    process.exit(0);
}

async function main() {
    console.log(`🚀 Starting AI Video Engine for: "${TOPIC}"`);

    const outputDir = path.join(__dirname, 'output', TOPIC.replace(/ /g, '_'));
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // 1. Script
    let script;
    try {
        script = await generateScript(TOPIC, GEMINI_API_KEY);
        console.log("✅ Script Generated:", script.length, "scenes");
        fs.writeFileSync(path.join(outputDir, 'script.json'), JSON.stringify(script, null, 2));
    } catch (e) {
        console.error("Script Failed:", e);
        return;
    }

    // 2. Audio & Visuals (Parallel-ish)
    for (let i = 0; i < script.length; i++) {
        const scene = script[i];

        // Audio
        const audioPath = path.join(outputDir, `audio_${i}.mp3`);

        // Visuals
        const imagePath = path.join(outputDir, `image_${i}.jpg`);

        try {
            await Promise.all([
                generateAudio(scene.text, audioPath).then(() => scene.audioPath = audioPath),
                fetchVisual(scene.visual_prompt, outputDir, i).then(path => {
                    if (path) scene.imagePath = path;
                })
            ]);
        } catch (e) {
            console.warn(`Error generating assets for scene ${i}:`, e.message);
        }
    }

    // 3. Assemble
    try {
        const finalVideo = await assembleVideo(script, outputDir);
        console.log("\n🎉 Video Creation Complete!");
        console.log("Output:", finalVideo);

        // Open the file for the user
        const { exec } = require('child_process');
        exec(`open "${finalVideo}"`);
    } catch (e) {
        console.error("Assembly Failed:", e);
    }
}

main();
