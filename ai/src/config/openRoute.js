import { OpenRouter } from "@openrouter/sdk";

// Use REACT_APP_OPENROUTER_API_KEY for OpenRouter API
const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

const openRouter = apiKey ? new OpenRouter({ 
  apiKey: apiKey,
  fetchOptions: {
    headers: {
      "HTTP-Referer": window.location.origin, 
      "X-Title": "My AI Chat App",
    }
  }
}) : null;


// ============================================V3==============================================

export async function openRouter_runChat(prompt, imageFile = null) {
    if (!openRouter) throw new Error("SDK not initialized. Check your API Key.");

    let finalImageUrl = null;
    // Handle binary files (images)
    if (imageFile instanceof File || imageFile instanceof Blob) {
        finalImageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imageFile);
        });
    }

    // Determine model list based on task type
    let modelList = finalImageUrl 
        ? ["google/gemini-2.0-flash-exp:free", "google/gemma-3-27b-it:free"]
        : ["meta-llama/llama-3.3-70b-instruct:free", "google/gemini-2.0-flash-preview:free", "openrouter/auto"];

    // Update models if prompt is code-related
    if (!finalImageUrl && (prompt.toLowerCase().includes("code") || prompt.includes("{"))) {
        modelList = ["qwen/qwen3-coder:free", ...modelList];
    }

   for (const modelId of modelList) {
    try {
        console.log(`📡 SDK Attempting: ${modelId}`);

        // Construct the message content
        const messageContent = finalImageUrl 
            ? [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: finalImageUrl } }
              ]
            : prompt;

        // The error suggests it needs the generation params object
        const response = await Promise.race([
            openRouter.chat.send({
                model: modelId,
                messages: [{ role: 'user', content: prompt }],
                // Adding this often fixes the "expected object, received undefined" error
                prompt: undefined, 
                stream: false,
            }, {}), // Some SDK versions require an options object as a second argument
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000))
        ]);

        if (response?.choices?.[0]?.message?.content) {
            return response.choices[0].message.content;
        }
    } catch (error) {
        console.warn(`❌ Model ${modelId} failed:`, error.message);
    }
}

    return "All free models are currently unavailable. Please try again in a moment.";
}

// ============================================V2==============================================

// const MODEL_FALLBACK_LIST = [
//     // 1. TOP TIER (Smartest & Most Stable)
//     "meta-llama/llama-3.3-70b-instruct:free",   // GPT-4 level logic
//     "google/gemini-2.0-flash-exp:free",         // Extremely fast, 1M context
    
//     // 2. MID TIER (Fast & Modern)
//     "mistralai/mistral-small-3.1-24b-instruct:free", // Great for structured data
//     "google/gemma-3-27b-it:free",              // Newest Google open model
//     "qwen/qwen3-coder:free",                   // Excellent if the prompt is code-related
    
//     // 3. SPECIALIZED (Reasoning/Thinking)
//     "deepseek/deepseek-r1:free",               // Deep "Thinking" reasoning
//     "z-ai/glm-4.5-air:free",                   // Great multilingual support
    
//     // 4. LAST RESORT (The Safety Net)
//     "openrouter/free"                          // Automatically picks any available free model
// ];

// export async function openRouter_runChat(prompt) {
//     if (!openRouter) {
//         throw new Error("API key not found.");
//     }

//     // Try each model in the list until one works
//     for (const modelId of MODEL_FALLBACK_LIST) {
//         try {
//             // We wrap the fetch in a Promise.race to handle "taking too much time"
//             const result = await Promise.race([
//                 openRouter.chat.completions.create({
//                     messages: [{ role: "user", content: prompt }],
//                     model: modelId,
//                 }),
//                 new Promise((_, reject) => 
//                     setTimeout(() => reject(new Error("Timeout")), 8000) // 8 second timeout
//                 )
//             ]);

//             if (result?.choices?.[0]?.message?.content) {
//                 return result.choices[0].message.content;
//             }
//         } catch (error) {
//             console.warn(`Model ${modelId} failed or timed out. Trying next...`);
//             // The loop continues to the next model in MODEL_FALLBACK_LIST
//         }
//     }

//     return "All free models are currently busy or slow. Please try again in a moment.";
// }


// ============================================V1==============================================

// export async function openRouter_runChat(prompt) {
//     if (!openRouter) {
//         throw new Error("API key not found. Please set REACT_APP_OPENROUTER_API_KEY in your .env file.");
//     }

//     try {
//         const result = await openRouter.chat.send({
//             messages: [
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],
//             // Using a free model provided by OpenRouter
//             model: "google/gemini-2.5-flash:free",
//         });

//         if (result && result.choices && result.choices.length > 0) {
//             return result.choices[0].message.content;
//         } else {
//             return "No response received from Nexus AI.";
//         }
//     } catch (error) {
//         console.error("Error from OpenRouter API:", error);
//         throw error;
//     }
// }



