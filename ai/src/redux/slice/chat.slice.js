import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { gemini_runChat } from '../../config/gemini';
import axios from 'axios';
import { BASE_URL } from '../../Utils/baseUrl';

// Get token helper
const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('Token')}`,
    }
});

export const fetchThreads = createAsyncThunk(
    'chat/fetchThreads', async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/threads`, getConfig());
            // Depending on pagination or direct array return format in Laravel:
            return response.data?.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const fetchThreadMessages = createAsyncThunk(
    'chat/fetchThreadMessages', async (threadId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/threads/${threadId}`, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const createThread = createAsyncThunk(
    'chat/createThread', async (title, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/threads`, { title }, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const deleteThread = createAsyncThunk(
    'chat/deleteThread', async (threadId, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/threads/${threadId}`, getConfig());
            return threadId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const renameThread = createAsyncThunk(
    'chat/renameThread', async ({ threadId, title }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}/threads/${threadId}`, { title }, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

// Async thunk to simulate receiving a response for a prompt
export const sendPrompt = createAsyncThunk(
    'chat/sendPrompt',
    async ({ prompt, imageUrl }, { rejectWithValue, getState, dispatch }) => {
        try {
            if (!prompt && !imageUrl) return;
            const state = getState();

            let threadId = state.chat.currentThreadId;
            let formattedTitle = prompt ? prompt.substring(0, 30) + (prompt.length > 30 ? "..." : "") : "Image chat";

            // If no active thread, create one
            if (!threadId) {
                const threadResponse = await axios.post(`${BASE_URL}/threads`, { title: formattedTitle }, getConfig());
                threadId = threadResponse.data.id;
                dispatch(setCurrentThreadId(threadId));
                dispatch(fetchThreads());
            }

            // Save user message to database
            await axios.post(`${BASE_URL}/messages`, {
                thread_id: threadId,
                role: 'user',
                message: prompt || ""
            }, getConfig());

            // Get previous messages to maintain history
            const previousMessages = state.chat.messages;
            let formattedHistory = previousMessages.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            // We need to exclude the current prompt from the history passed to startChat.
            if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user' && formattedHistory[formattedHistory.length - 1].parts[0].text === (prompt || "")) {
                formattedHistory.pop();
            }

            const responseText = await gemini_runChat(prompt || "", formattedHistory);

            // Save model message to database
            await axios.post(`${BASE_URL}/messages`, {
                thread_id: threadId,
                role: 'model',
                message: responseText
            }, getConfig());

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
    threads: [],
    currentThreadId: null,
    prevPrompts: [],    // kept for safe fallbacks
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
        },
        setCurrentThreadId: (state, action) => {
            state.currentThreadId = action.payload;
        },
        newChat: (state) => {
            if (!state.isLoading) {
                state.recentPrompt = '';
                state.currentResponse = '';
                state.messages = [];
                state.currentThreadId = null;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendPrompt.pending, (state, action) => {
                state.isLoading = true;
                // We add the user prompt optimistically if it's available in meta.arg
                if (action.meta && action.meta.arg) {
                    const { prompt, imageUrl } = action.meta.arg;
                    state.messages.push({ role: 'user', text: prompt || '', imageUrl });
                }
            })
            .addCase(sendPrompt.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload && action.payload.prompt) {
                    state.currentResponse = action.payload.response;
                    state.messages.push({ role: 'model', text: action.payload.response });
                }
            })
            .addCase(sendPrompt.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload || "Failed to get response");
            })
            .addCase(fetchThreads.fulfilled, (state, action) => {
                state.threads = action.payload || [];
            })
            .addCase(fetchThreadMessages.pending, (state) => {
                state.isLoading = true;
                state.messages = [];
            })
            .addCase(fetchThreadMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.currentThreadId = action.payload.id;
                    state.recentPrompt = action.payload.title;
                    if (action.payload.messages) {
                        state.messages = action.payload.messages.map(msg => ({
                            id: msg.id,
                            role: msg.role,
                            text: msg.message,
                            created_at: msg.created_at
                        }));
                    } else {
                        state.messages = [];
                    }
                }
            })
            .addCase(fetchThreadMessages.rejected, (state, action) => {
                state.isLoading = false;
                toast.error("Failed to load thread messages");
            })
            .addCase(deleteThread.fulfilled, (state, action) => {
                state.threads = state.threads.filter(t => t.id !== action.payload);
                if (state.currentThreadId === action.payload) {
                    state.currentThreadId = null;
                    state.messages = [];
                    state.recentPrompt = '';
                }
                toast.success("Chat deleted");
            })
            .addCase(renameThread.fulfilled, (state, action) => {
                const index = state.threads.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.threads[index] = action.payload;
                }
                if (state.currentThreadId === action.payload.id) {
                    state.recentPrompt = action.payload.title;
                }
                toast.success("Chat renamed");
            });
    }
});

export const { setTheme, setIsMobileSidebarOpen, setRecentPromptSafe, setCurrentThreadId, newChat } = chatSlice.actions;
export default chatSlice.reducer;
