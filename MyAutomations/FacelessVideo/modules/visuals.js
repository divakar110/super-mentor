const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, dest) {
    const writer = fs.createWriteStream(dest);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function fetchVisual(prompt, outputDir, index) {
    console.log(`\n🎨 Generating AI Image for scene ${index}...`);
    console.log(`   Prompt: "${prompt.substring(0, 50)}..."`);

    // Pollinations.ai URL format (Flux model is usually default or we can specify)
    // We encode the prompt to be URL safe
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&model=flux`;

    const dest = path.join(outputDir, `image_${index}.jpg`);

    try {
        await downloadImage(url, dest);
        console.log(`   - Saved to ${dest}`);
        return dest;
    } catch (error) {
        console.error("Image Gen Error:", error.message);
        // Fallback or retry logic could go here
        return null;
    }
}

module.exports = { fetchVisual };
