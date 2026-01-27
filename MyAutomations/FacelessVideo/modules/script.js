const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateScript(topic, apiKey) {
    if (!apiKey) throw new Error("Gemini API Key is required");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a professional documentary scriptwriter.
    Create a structured script for a video about: "${topic}".
    
    The output MUST be a valid JSON array of objects. Each object represents a scene.
    Format:
    [
        {
            "text": "The exact spoken narration for this scene.",
            "visual_prompt": "A highly detailed, cinematic AI image prompt describing the scene. Include style keywords like '8k', 'hyperrealistic', 'cinematic lighting', 'photorealistic'.",
            "duration_est": 5
        },
        ...
    ]

    Guidelines:
    - Keep narration engaging and concise.
    - "visual_prompt" must be DESCRIPTIVE (e.g., "A dusty ancient library with shafts of sunlight, 8k, cinematic").
    - Total duration: aim for ~60 seconds total.
    - Ensure strict JSON format. No markdown code blocks.
    `;

    try {
        console.log(`\n🧠 Generating script for: "${topic}"...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim(); // Clean markdown
        return JSON.parse(text);
    } catch (error) {
        console.error("Script Gen Error:", error.message);
        throw error;
    }
}

module.exports = { generateScript };
