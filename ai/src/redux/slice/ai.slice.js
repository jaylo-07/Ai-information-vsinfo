import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { detectPromptType } from "../../Utils/detectPromptType";
import { BASE_URL } from "../../Utils/baseUrl";

export const sendAIRequest = createAsyncThunk(
    "ai/sendRequest",
    async (payload, { rejectWithValue }) => {
        try {
            let prompt = payload;
            let image = null;
            if (typeof payload === 'object' && payload !== null) {
                prompt = payload.prompt || "";
                image = payload.image || null;
            }

            const type = detectPromptType(prompt);

            if (type === "image") {
                const response = await fetch(`${BASE_URL}/generate-image`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ prompt, image })
                });

                if (!response.ok) {
                    throw new Error("Image generation failed");
                }

                const data = await response.json();
                const imageUrl = `data:image/png;base64,${data.image}`;

                return { type: "image", data: imageUrl };
            }

            // TEXT MODEL
            const response = await fetch(`${BASE_URL}/generate-text`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt, image })
            });

            if (!response.ok) {
                let errMessage = "Text generation failed";
                try {
                    const errData = await response.json();
                    if (errData.error) errMessage = errData.error;
                } catch (e) {
                    // ignore
                }
                throw new Error(errMessage);
            }

            const data = await response.json();

            return {
                type: "text",
                data: data.generated_text || "No response"
            };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        loading: false,
        result: null,
        type: null,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendAIRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendAIRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload.data;
                state.type = action.payload.type;
            })
            .addCase(sendAIRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default aiSlice.reducer;
