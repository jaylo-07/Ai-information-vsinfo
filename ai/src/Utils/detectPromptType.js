export function detectPromptType(prompt) {
    const imageKeywords = [
        "create image",
        "generate image",
        "draw",
        "photo",
        "portrait",
        "picture",
        "illustration",
        "art",
        "realistic image"
    ];

    const lowerPrompt = prompt.toLowerCase();

    const isImage = imageKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
    );

    return isImage ? "image" : "text";
}