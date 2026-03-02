import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { runChat } from '../../config/gemini';
import { toast } from 'react-hot-toast';

// Async thunk to simulate receiving a response for a prompt
export const sendPrompt = createAsyncThunk(
    'chat/sendPrompt',
    async (prompt, { rejectWithValue, getState }) => {
        try {
            if (!prompt) return;
            const state = getState();

            // Get previous messages to maintain history
            const previousMessages = state.chat.messages;
            let formattedHistory = previousMessages.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            // The pending reducer adds the current prompt to state.messages before this async callback executes.
            // We need to exclude the current prompt from the history passed to startChat.
            if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user' && formattedHistory[formattedHistory.length - 1].parts[0].text === prompt) {
                formattedHistory.pop();
            }

            const responseText = await runChat(prompt, formattedHistory);
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
    currentResponse: '',
    messages: [] // Store the chat history for the current session
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
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendPrompt.pending, (state, action) => {
                state.isLoading = true;
                // We add the user prompt optimistically if it's available in meta.arg
                if (action.meta && action.meta.arg) {
                    state.messages.push({ role: 'user', text: action.meta.arg });
                }
            })
            .addCase(sendPrompt.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload && action.payload.prompt) {
                    if (!state.prevPrompts.includes(action.payload.prompt)) {
                        state.prevPrompts.push(action.payload.prompt);
                    }
                    state.currentResponse = action.payload.response;
                    state.messages.push({ role: 'model', text: action.payload.response });
                }
            })
            .addCase(sendPrompt.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload || "Failed to get response");
                // Remove the optimistically added user prompt on failure, or could leave it and add an error message.
            });
    }
});

export const { setTheme, setIsMobileSidebarOpen, setRecentPromptSafe, newChat } = chatSlice.actions;
export default chatSlice.reducer;
