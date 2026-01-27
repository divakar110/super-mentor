const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { promisify } = require('util');
const ffprobe = promisify(ffmpeg.ffprobe);

async function getAudioDuration(filePath) {
    try {
        const metadata = await ffprobe(filePath);
        return metadata.format.duration;
    } catch (e) {
        console.error("Error probing audio:", e);
        return 10; // Fallback
    }
}

async function renderScene(imagePath, audioPath, outputPath) {
    return new Promise(async (resolve, reject) => {
        // 1. Get exact audio duration to match video length
        const duration = await getAudioDuration(audioPath);

        // 2. Ken Burns Effect (Slow Zoom In)
        // d=duration in frames (fps*seconds). Let's assume 25fps.
        // But zoompan 'd' is just the length of the zoom effect filter. 
        // We set it high enough to cover the whole clip.
        // z='min(zoom+0.0015,1.5)' -> Zoom speed
        // x/y=... -> Center zoom

        const zoomSpeed = 0.002;
        const fps = 30;
        const totalFrames = Math.ceil(duration * fps) + 50; // Buffer

        console.log(`   - Rendering scene (${duration.toFixed(1)}s) with Motion...`);

        ffmpeg()
            .input(imagePath)
            .loop(duration) // Loop image for audio duration
            .input(audioPath)
            .videoFilters([
                `zoompan=z='min(zoom+${zoomSpeed},1.5)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720`
            ])
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-r 30',          // 30 fps
                '-t ' + duration, // Cut exactly at audio end
                '-shortest'
            ])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
}

async function assembleVideo(scenes, outputDir) {
    console.log("\n🎬 Assembling final video...");
    const segmentPaths = [];

    // 1. Render individual segments
    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];

        // We need both image and audio
        if (scene.imagePath && scene.audioPath) {
            const segOut = `${outputDir}/segment_${i}.mp4`;
            try {
                // Check if file exists to skip re-render (dev speed)
                // if (!fs.existsSync(segOut)) ...

                await renderScene(scene.imagePath, scene.audioPath, segOut);
                segmentPaths.push(segOut);
                console.log(`   ✅ Rendered segment ${i}`);
            } catch (e) {
                console.error(`   ❌ Failed to render segment ${i}:`, e.message);
            }
        } else {
            console.warn(`   ⚠️ Skipping segment ${i} (Missing assets)`);
        }
    }

    // 2. Concatenate segments
    if (segmentPaths.length === 0) return null;

    const finalOutput = `${outputDir}/final_video.mp4`;
    const fileListPath = `${outputDir}/files.txt`;

    // Create ffmpeg concat list
    const fileContent = segmentPaths.map(p => `file '${p}'`).join('\n');
    fs.writeFileSync(fileListPath, fileContent);

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(fileListPath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions(['-c copy']) // Fast concat without re-encoding
            .save(finalOutput)
            .on('end', () => {
                resolve(finalOutput);
            })
            .on('error', (err) => reject(err));
    });
}

module.exports = { assembleVideo };
