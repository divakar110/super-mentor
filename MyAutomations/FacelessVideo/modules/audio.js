const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Note: We are using the Python 'edge-tts' CLI wrapper for reliability if available, 
// OR we can try to use a node library. 
// For this '0-cost' requirement, the most robust way across systems without API keys is widely considered 
// to be the Python 'edge-tts' package.
// HOWEVER, since we are in a Node environment, let's try to use a direct library if possible, 
// or fallback to a simple command line check.
//
// For this implementation, we will assume 'edge-tts' (python) is installed or we use a node wrapper.
// Let's use a standard node library approach for 'edge-tts' if available, otherwise suggest installation.
// Actually, 'edge-tts' npm package is often a wrapper.
// Let's stick to a safe bet: We will use a library that hits the Edge endpoint directly.

async function generateAudio(text, outputPath) {
    console.log(`\n🎙️ Generating audio for: "${text.substring(0, 20)}..."`);

    // Using a direct request approach to avoid python dependency hell for the user
    // Start of simple Edge TTS implementation without external CLI dependency

    // NOTE: For robust production, use the 'edge-tts' CLI. 
    // Here we will try to use the 'edge-tts' npm package if it works as a CLI wrapper,
    // otherwise we might need to instruct user to pip install edge-tts.

    // Command line approach (User needs: pip install edge-tts)
    // This is the most reliable "Free" method currently.

    const command = `edge-tts --text "${text.replace(/"/g, '\\"')}" --write-media "${outputPath}" --voice en-US-ChristopherNeural`;

    try {
        await execPromise(command);
        if (fs.existsSync(outputPath)) {
            return outputPath;
        } else {
            throw new Error("Output file not created");
        }
    } catch (error) {
        console.error("Audio Gen Error. Make sure you have 'edge-tts' installed (pip install edge-tts)");
        throw error;
    }
}

module.exports = { generateAudio };
