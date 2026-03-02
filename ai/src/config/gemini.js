import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the provided API key (Note: For production, it's recommended to continue using process.env.REACT_APP_GEMINI_API_KEY)
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function runChat(prompt, history = []) {
    // Updated to the new gemini-3-flash-preview model as mentioned in your URL
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
}
