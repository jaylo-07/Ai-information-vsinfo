import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { runChat } from '../../config/gemini';

// Async thunk to simulate receiving a response for a prompt
export const sendPrompt = createAsyncThunk(
    'chat/sendPrompt',
    async (prompt, { rejectWithValue }) => {
        try {
            if (!prompt) return;
            const responseText = await runChat(prompt);
            return {
                prompt: prompt,
                response: responseText
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
    }
    return 'System';
};

const initialState = {
    prevPrompts: [],
    recentPrompt: '',
    theme: getInitialTheme(),
    isMobileSidebarOpen: false,
    isLoading: false,
    currentResponse: ''
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', action.payload);
            }
        },
        setIsMobileSidebarOpen: (state, action) => {
            state.isMobileSidebarOpen = action.payload;
        },
        setRecentPromptSafe: (state, action) => {
            state.recentPrompt = action.payload;
            if (action.payload && !state.prevPrompts.includes(action.payload)) {
                state.prevPrompts.push(action.payload);
            }
        },
        newChat: (state) => {
            state.recentPrompt = '';
            state.currentResponse = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendPrompt.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendPrompt.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload && action.payload.prompt) {
                    if (!state.prevPrompts.includes(action.payload.prompt)) {
                        state.prevPrompts.push(action.payload.prompt);
                    }
                    state.currentResponse = action.payload.response;
                }
            })
            .addCase(sendPrompt.rejected, (state) => {
                state.isLoading = false;
            });
    }
});

export const { setTheme, setIsMobileSidebarOpen, setRecentPromptSafe, newChat } = chatSlice.actions;
export default chatSlice.reducer;
