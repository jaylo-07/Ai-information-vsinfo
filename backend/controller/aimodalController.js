const { HfInference } = require("@huggingface/inference");

exports.generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;

        const client = new HfInference(process.env.HF_TOKEN);

        // HF updated its routing system; we use their official inference client
        const imageBlob = await client.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            provider: "hf-inference",
            inputs: prompt
        });

        // Convert the Blob to a Buffer and then to base64
        const arrayBuffer = await imageBlob.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        res.json({ image: base64Image });

    } catch (error) {
        console.error("HF Inference Error:", error.message);
        res.status(500).json({ error: "Image generation failed" });
    }
};

// exports.generateImage = async (req, res) => {
//     try {
//         const { prompt } = req.body;

//         const client = new HfInference(process.env.HF_TOKEN);

//         const imageBlob = await client.textToImage({
//             model: "runwayml/stable-diffusion-v1-5",
//             inputs: prompt
//         });

//         const arrayBuffer = await imageBlob.arrayBuffer();
//         const base64Image = Buffer.from(arrayBuffer).toString("base64");

//         res.json({ image: base64Image });

//     } catch (error) {
//         console.error("HF Inference Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.generateText = async (req, res) => {
    try {
        const { prompt } = req.body;

        const client = new HfInference(process.env.HF_TOKEN);

        const response = await client.chatCompletion({
            model: "meta-llama/Meta-Llama-3-8B-Instruct", // Update this line
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500 // Good practice to add a limit
        });

        res.json({ generated_text: response.choices[0].message.content });

    } catch (error) {
        console.error("HF Text Inference Error:", error.message);
        res.status(500).json({ error: error.message || "Text generation failed" });
    }
};

// exports.generateText = async (req, res) => {
//     try {
//         const { prompt } = req.body;

//         const client = new HfInference(process.env.HF_TOKEN);

//         const response = await client.textGeneration({
//             model: "google/flan-t5-large",
//             inputs: prompt,
//             parameters: {
//                 max_new_tokens: 300,
//                 temperature: 0.7
//             }
//         });

//         res.json({ generated_text: response.generated_text });

//     } catch (error) {
//         console.error("HF Text Inference Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };