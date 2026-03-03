import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { gemini_runChat } from '../../config/gemini';
import axios from 'axios';
import { BASE_URL } from '../../Utils/baseUrl';
import { sendAIRequest } from './ai.slice';

// Get token helper
const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('Token')}`,
    }
});

const isUserLoggedIn = () => !!(typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('Token')));

const getLocalThreads = () => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('localThreads') || '[]');
};
const saveLocalThreads = (threads) => {
    if (typeof window !== 'undefined') localStorage.setItem('localThreads', JSON.stringify(threads));
};
const getLocalThreadMessages = (threadId) => {
    if (typeof window === 'undefined') return [];
    const msgs = JSON.parse(localStorage.getItem('localMessages') || '{}');
    return msgs[threadId] || [];
};
const saveLocalThreadMessage = (threadId, message) => {
    if (typeof window === 'undefined') return;
    const msgs = JSON.parse(localStorage.getItem('localMessages') || '{}');
    if (!msgs[threadId]) msgs[threadId] = [];
    msgs[threadId].push(message);
    localStorage.setItem('localMessages', JSON.stringify(msgs));
};
const deleteLocalThread = (threadId) => {
    if (typeof window === 'undefined') return;
    const threads = getLocalThreads().filter(t => t.id !== threadId);
    saveLocalThreads(threads);
    const msgs = JSON.parse(localStorage.getItem('localMessages') || '{}');
    delete msgs[threadId];
    localStorage.setItem('localMessages', JSON.stringify(msgs));
};
const renameLocalThread = (threadId, title) => {
    if (typeof window === 'undefined') return;
    const threads = getLocalThreads().map(t => t.id === threadId ? { ...t, title } : t);
    saveLocalThreads(threads);
};

export const fetchThreads = createAsyncThunk(
    'chat/fetchThreads', async (_, { rejectWithValue }) => {
        try {
            if (!isUserLoggedIn()) return getLocalThreads();
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
            if (!isUserLoggedIn()) {
                const thread = getLocalThreads().find(t => t.id === threadId);
                const messages = getLocalThreadMessages(threadId);
                return {
                    id: threadId,
                    title: thread?.title || 'Local Chat',
                    messages: messages
                };
            }
            const response = await axios.get(`${BASE_URL}/threads/${threadId}`, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const createThread = createAsyncThunk(
    'chat/createThread', async (title, { rejectWithValue }) => {
        try {
            if (!isUserLoggedIn()) {
                const newThread = { id: 'local_' + Date.now(), title, created_at: new Date().toISOString() };
                saveLocalThreads([newThread, ...getLocalThreads()]);
                return newThread;
            }
            const response = await axios.post(`${BASE_URL}/threads`, { title }, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const deleteThread = createAsyncThunk(
    'chat/deleteThread', async (threadId, { rejectWithValue }) => {
        try {
            if (!isUserLoggedIn()) {
                deleteLocalThread(threadId);
                return threadId;
            }
            await axios.delete(`${BASE_URL}/threads/${threadId}`, getConfig());
            return threadId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

export const renameThread = createAsyncThunk(
    'chat/renameThread', async ({ threadId, title }, { rejectWithValue }) => {
        try {
            if (!isUserLoggedIn()) {
                renameLocalThread(threadId, title);
                return { id: threadId, title };
            }
            const response = await axios.put(`${BASE_URL}/threads/${threadId}`, { title }, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

// ─── Deep Research Thunk ───────────────────────────────────────────────────
export const sendDeepResearch = createAsyncThunk(
    'chat/sendDeepResearch',
    async ({ query, depth, sources }, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState();
            let threadId = state.chat.currentThreadId;
            const title = query.substring(0, 30) + (query.length > 30 ? '...' : '');

            const isLoggedIn = isUserLoggedIn();
            const isTemp = state.chat.isTemporaryChat;

            if (!isTemp && !threadId) {
                if (isLoggedIn) {
                    const threadResponse = await axios.post(`${BASE_URL}/threads`, { title: `[Deep Research] ${title}` }, getConfig());
                    threadId = threadResponse.data.id;
                } else {
                    threadId = 'local_' + Date.now();
                    const newThread = { id: threadId, title: `[Deep Research] ${title}`, created_at: new Date().toISOString() };
                    saveLocalThreads([newThread, ...getLocalThreads()]);
                }
                dispatch(setCurrentThreadId(threadId));
                dispatch(fetchThreads());
            }

            // Save user message
            if (!isTemp) {
                if (isLoggedIn) {
                    await axios.post(`${BASE_URL}/messages`, {
                        thread_id: threadId,
                        role: 'user',
                        message: query
                    }, getConfig());
                } else {
                    saveLocalThreadMessage(threadId, {
                        id: 'msg_' + Date.now(),
                        role: 'user',
                        message: query,
                        created_at: new Date().toISOString()
                    });
                }
            }

            // Call backend deep-research endpoint
            const nodeApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${nodeApiUrl}/deep-research`, {
                query,
                depth,
                sources
            }, { ...getConfig(), timeout: 120000 });

            // Save model response
            if (!isTemp) {
                if (isLoggedIn) {
                    await axios.post(`${BASE_URL}/messages`, {
                        thread_id: threadId,
                        role: 'model',
                        message: data.report
                    }, getConfig());
                } else {
                    saveLocalThreadMessage(threadId, {
                        id: 'msg_' + Date.now(),
                        role: 'model',
                        message: data.report,
                        created_at: new Date().toISOString()
                    });
                }
            }

            return {
                query,
                subQuestions: data.subQuestions,
                sources: data.sources,
                report: data.report,
                sourcesCount: data.sourcesCount,
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.error || error.message);
        }
    }
);

// Async thunk to simulate receiving a response for a prompt
export const sendPrompt = createAsyncThunk(
    'chat/sendPrompt',
    async ({ prompt, imageUrl, actionType }, { rejectWithValue, getState, dispatch }) => {
        try {
            if (!prompt && !imageUrl) return;
            const state = getState();

            let threadId = state.chat.currentThreadId;
            let formattedTitle = prompt ? prompt.substring(0, 30) + (prompt.length > 30 ? "..." : "") : "Image chat";

            const isLoggedIn = isUserLoggedIn();
            const isTemp = state.chat.isTemporaryChat;

            // If no active thread, create one
            if (!isTemp && !threadId) {
                if (isLoggedIn) {
                    const threadResponse = await axios.post(`${BASE_URL}/threads`, { title: formattedTitle }, getConfig());
                    threadId = threadResponse.data.id;
                } else {
                    threadId = 'local_' + Date.now();
                    const newThread = { id: threadId, title: formattedTitle, created_at: new Date().toISOString() };
                    saveLocalThreads([newThread, ...getLocalThreads()]);
                }
                dispatch(setCurrentThreadId(threadId));
                dispatch(fetchThreads());
            }

            // Save user message to database
            if (!isTemp) {
                if (isLoggedIn) {
                    await axios.post(`${BASE_URL}/messages`, {
                        thread_id: threadId,
                        role: 'user',
                        message: prompt || ""
                    }, getConfig());
                } else {
                    saveLocalThreadMessage(threadId, {
                        id: 'msg_' + Date.now(),
                        role: 'user',
                        message: prompt || "",
                        created_at: new Date().toISOString()
                    });
                }
            }

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

            let responseText = "";
            let generatedModelImageUrl = null;

            // Using the new Hugging Face models via aiSlice
            const aiResponse = await dispatch(sendAIRequest({ prompt: prompt || "", image: imageUrl })).unwrap();

            if (aiResponse.type === "image") {
                generatedModelImageUrl = aiResponse.data;
                // responseText = "Here is the image you requested.";
            } else {
                responseText = aiResponse.data;
            }

            // Save model message to database
            if (!isTemp) {
                if (isLoggedIn) {
                    await axios.post(`${BASE_URL}/messages`, {
                        thread_id: threadId,
                        role: 'model',
                        message: responseText
                    }, getConfig());
                } else {
                    saveLocalThreadMessage(threadId, {
                        id: 'msg_' + Date.now(),
                        role: 'model',
                        message: responseText,
                        created_at: new Date().toISOString()
                    });
                }
            }

            return {
                prompt: prompt,
                response: responseText,
                generatedImageUrl: generatedModelImageUrl
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
    messages: [], // Store the chat history for the current session
    isTemporaryChat: false,
    // Deep Research
    isResearching: false,
    researchSteps: [],    // live step-by-step progress
    researchResult: null, // { subQuestions, sources, report, sourcesCount }
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
        setIsTemporaryChat: (state, action) => {
            state.isTemporaryChat = action.payload;
            state.recentPrompt = '';
            state.currentResponse = '';
            state.messages = [];
            state.currentThreadId = null;
        },
        newChat: (state) => {
            if (!state.isLoading) {
                state.recentPrompt = '';
                state.currentResponse = '';
                state.messages = [];
                state.currentThreadId = null;
                state.isTemporaryChat = false;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendPrompt.pending, (state, action) => {
                state.isLoading = true;
                if (action.meta && action.meta.arg) {
                    const { prompt, imageUrl } = action.meta.arg;
                    state.messages.push({ role: 'user', text: prompt || '', imageUrl });
                }
            })
            .addCase(sendPrompt.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload && action.payload.prompt) {
                    state.currentResponse = action.payload.response;
                    state.messages.push({
                        role: 'model',
                        text: action.payload.response,
                        generatedImageUrl: action.payload.generatedImageUrl
                    });
                }
            })
            .addCase(sendPrompt.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload || "Failed to get response");
            })
            // ── Deep Research ──────────────────────────────────────────
            .addCase(sendDeepResearch.pending, (state, action) => {
                state.isResearching = true;
                state.researchResult = null;
                state.researchSteps = [
                    { id: 1, label: 'Breaking query into sub-questions...', done: false },
                    { id: 2, label: 'Searching the web for sources...', done: false },
                    { id: 3, label: 'Reading & extracting content...', done: false },
                    { id: 4, label: 'Synthesizing research report...', done: false },
                ];
                if (action.meta?.arg?.query) {
                    state.messages.push({ role: 'user', text: action.meta.arg.query, isDeepResearch: true });
                }
            })
            .addCase(sendDeepResearch.fulfilled, (state, action) => {
                state.isResearching = false;
                state.researchSteps = state.researchSteps.map(s => ({ ...s, done: true }));
                state.researchResult = action.payload;
                state.messages.push({
                    role: 'model',
                    text: action.payload.report,
                    isDeepResearch: true,
                    sources: action.payload.sources,
                    subQuestions: action.payload.subQuestions,
                    sourcesCount: action.payload.sourcesCount,
                });
                state.researchSteps = [];
            })
            .addCase(sendDeepResearch.rejected, (state, action) => {
                state.isResearching = false;
                state.researchSteps = [];
                toast.error(action.payload || 'Deep Research failed. Check API keys.');
                // Remove the optimistic user message
                if (state.messages.length && state.messages[state.messages.length - 1].role === 'user') {
                    state.messages.pop();
                }
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

export const generateImage = createAsyncThunk(
    "image/generate",
    async (prompt, { rejectWithValue }) => {
        try {
            const nodeApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.post(
                `${nodeApiUrl}/generate-image`,
                { prompt },
                { ...getConfig(), timeout: 120000 }
            );
            return response.data.image;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const { setTheme, setIsMobileSidebarOpen, setRecentPromptSafe, setCurrentThreadId, newChat, setIsTemporaryChat } = chatSlice.actions;
export default chatSlice.reducer;
