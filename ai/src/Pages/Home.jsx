import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, SlidersHorizontal, Search, Image as ImageIcon, LayoutPanelTop, GraduationCap, Upload, Images, File as FileIcon, X, SendHorizontal, Sparkles, Paintbrush, BarChart3, Code2, Lightbulb, MessageSquareDashed, Download, Copy, Check } from 'lucide-react';
import { sendPrompt, sendDeepResearch } from '../redux/slice/chat.slice';
import { Globe, BookOpen, Newspaper, Zap, Scale, Layers, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Code Block Renderer ──────────────────────────────────────────────────────
const CodeBlockRenderer = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!inline && match) {
        return (
            <div className="rounded-xl overflow-hidden m-2 border border-gray-200 dark:border-white/10 shadow-lg group">
                <div className="px-4 py-2 bg-gray-100 dark:bg-[#121212] text-xs font-mono text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 flex justify-between items-center transition-colors duration-300">
                    <span className="uppercase tracking-wider font-semibold">{match[1]}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200"
                        title="Copy code"
                    >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px] sm:text-xs">{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <SyntaxHighlighter {...props} style={dracula} language={match[1]} PreTag="div" className="!m-0 !bg-[#1e1e1e] text-[13px] sm:text-sm">
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            </div>
        );
    }
    return (
        <code {...props} className="bg-gray-100 dark:bg-gray-800 rounded-md px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400">
            {children}
        </code>
    );
};

// ─── Deep Research Sources Card ───────────────────────────────────────────────
const DeepResearchSourcesCard = ({ sources = [], subQuestions = [] }) => {
    const [showSources, setShowSources] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    return (
        <div className="mt-4 flex flex-col gap-2 not-prose">
            {/* Sub-Questions Toggle */}
            {subQuestions.length > 0 && (
                <div className="border border-blue-200 dark:border-blue-500/30 rounded-2xl overflow-hidden bg-blue-50/50 dark:bg-blue-500/5">
                    <button
                        type="button"
                        onClick={() => setShowQuestions(v => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                                {subQuestions.length} Sub-Questions Researched
                            </span>
                        </div>
                        {showQuestions ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />}
                    </button>
                    {showQuestions && (
                        <div className="px-4 pb-3 flex flex-col gap-2 border-t border-blue-200 dark:border-blue-500/20 pt-3">
                            {subQuestions.map((q, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 mt-0.5 shrink-0 w-4">{i + 1}.</span>
                                    <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{q}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sources Toggle */}
            {sources.length > 0 && (
                <div className="border border-purple-200 dark:border-purple-500/30 rounded-2xl overflow-hidden bg-purple-50/50 dark:bg-purple-500/5">
                    <button
                        type="button"
                        onClick={() => setShowSources(v => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                                {sources.length} Sources Used
                            </span>
                        </div>
                        {showSources ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />}
                    </button>
                    {showSources && (
                        <div className="px-4 pb-3 flex flex-col gap-2 border-t border-purple-200 dark:border-purple-500/20 pt-3">
                            {sources.map((s, i) => {
                                let hostname = '';
                                try { hostname = new URL(s.link).hostname.replace('www.', ''); } catch { }
                                return (
                                    <a
                                        key={i}
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                                            alt=""
                                            className="w-5 h-5 rounded shrink-0 mt-0.5"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">[{i + 1}]</span>
                                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{s.title}</p>
                                                <ExternalLink className="w-3 h-3 text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{hostname}</p>
                                            {s.snippet && <p className="text-[11px] text-gray-500 dark:text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{s.snippet}</p>}
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Home = () => {
    const messages = useSelector((state) => state.chat.messages);
    const isLoading = useSelector((state) => state.chat.isLoading);
    const isTemporaryChat = useSelector((state) => state.chat.isTemporaryChat);
    const isResearching = useSelector((state) => state.chat.isResearching);
    const researchSteps = useSelector((state) => state.chat.researchSteps);
    const user = useSelector((state) => state.auth?.user);

    const [openMenu, setOpenMenu] = useState(null);
    const [activeTool, setActiveTool] = useState(null);
    const menuRootRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);

    // Deep Research state
    const [deepResearchOpen, setDeepResearchOpen] = useState(false);
    const [researchDepth, setResearchDepth] = useState('Balanced');
    const [researchSources, setResearchSources] = useState({ Web: true, Academic: false, News: false });

    const isDeepResearchActive = activeTool?.label === 'Deep Research';

    useEffect(() => {
        const handleResize = () => setIsMdScreen(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const photoInputRef = useRef(null);
    const [attachments, setAttachments] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const dispatch = useDispatch();
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [greeting] = useState(() => {
        const phrases = [
            "Ready to assist you.",
            "How can I help you today?",
            "What's on your mind?",
            "Good to see you. How can I help?",
            "Let's make something amazing today.",
            "What would you like to explore?",
            "How can I assist you right now?"
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    });

    const handleSend = () => {
        if (!inputValue.trim() && attachments.length === 0) return;

        if (isDeepResearchActive) {
            // Dispatch real deep research thunk
            dispatch(sendDeepResearch({
                query: inputValue.trim(),
                depth: researchDepth,
                sources: researchSources,
            }));
            setInputValue('');
            setAttachments([]);
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
            return;
        }

        let imageUrl = null;
        const imageAttachment = attachments.find(att => att.kind === 'photo');
        if (imageAttachment) imageUrl = imageAttachment.base64;

        dispatch(sendPrompt({ prompt: inputValue, imageUrl, actionType: activeTool?.label }));
        setInputValue('');
        setAttachments([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleDownloadImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const now = new Date();
            const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
            link.download = `vsinfotech-AI-${date}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            // Fallback
            const link = document.createElement('a');
            link.href = imageUrl;
            const now = new Date();
            const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
            link.download = `vsinfotech-AI-${date}.png`;
            link.target = '_blank'; // in case download fails, open in new tab
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const toolsMenuItems = useMemo(
        () => [
            { label: 'Deep Research', icon: <Search className="w-4 h-4" />, disabled: true },
            { label: 'Create Images', icon: <ImageIcon className="w-4 h-4" /> },
            { label: 'Canvas', icon: <LayoutPanelTop className="w-4 h-4" />, disabled: true },
            { label: 'Guided Learning', icon: <GraduationCap className="w-4 h-4" />, disabled: true },
        ],
        []
    );

    const plusMenuItems = useMemo(
        () => [
            { label: 'Upload Files', icon: <Upload className="w-4 h-4" /> },
            { label: 'Photos', icon: <Images className="w-4 h-4" /> },
        ],
        []
    );

    useEffect(() => {
        const onMouseDown = (e) => {
            if (!openMenu) return;
            if (menuRootRef.current && !menuRootRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpenMenu(null);
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [openMenu]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            recognitionRef.current = null;
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event) => {
            let combinedTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                combinedTranscript += event.results[i][0].transcript;
            }
            if (combinedTranscript) {
                setInputValue((prev) =>
                    prev ? `${prev.trim()} ${combinedTranscript.trim()}` : combinedTranscript.trim()
                );
            }
        };

        recognition.onerror = () => { };
        recognition.onend = () => { };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop?.();
            recognitionRef.current = null;
        };
    }, []);

    const quickActions = [
        { label: 'Create an Image', desc: 'Generate vivid art', icon: <Paintbrush className="w-6 h-6" /> },
        { label: 'Analyze Data', desc: 'Find insights fast', icon: <BarChart3 className="w-6 h-6" /> },
        { label: 'Write Code', desc: 'Build your app', icon: <Code2 className="w-6 h-6" /> },
        { label: 'Explain Concepts', desc: 'Learn something new', icon: <Lightbulb className="w-6 h-6" /> },
    ];

    const handlePlusMenuItemClick = (label) => {
        if (label === 'Upload Files') {
            fileInputRef.current?.click();
        } else if (label === 'Photos') {
            photoInputRef.current?.click();
        }
        setOpenMenu(null);
    };

    const addFilesToAttachments = async (files) => {
        if (!files?.length) return;

        const filePromises = files.map((file) => {
            return new Promise((resolve) => {
                const isImage = file.type.startsWith('image/');
                if (isImage) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            id: `${Date.now()}-${file.name}`,
                            file,
                            kind: 'photo',
                            previewUrl: reader.result,
                            base64: reader.result
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    resolve({
                        id: `${Date.now()}-${file.name}`,
                        file,
                        kind: 'file',
                        previewUrl: null,
                    });
                }
            });
        });

        const newAttachments = await Promise.all(filePromises);
        setAttachments((prev) => [...prev, ...newAttachments]);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        addFilesToAttachments(files);
        event.target.value = '';
    };

    const handleDragEnter = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) setIsDragOver(true);
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

    const handleDragLeave = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        addFilesToAttachments(files);
    };

    const handleRemoveAttachment = (id) => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    const getInputPlaceholder = () => {
        if (isTemporaryChat) return 'Ask questions in a temporary chat';
        if (!activeTool) return isMdScreen ? 'Ask to vsinfotech AI...' : 'Ask anything...';
        return `Using ${activeTool.label}...`;
    };

    return (
        <main className="flex-1 flex flex-col w-full h-full relative overflow-hidden bg-transparent transition-colors duration-300">
            <div className="z-10 w-full max-w-4xl mx-auto flex flex-col h-full pt-4 md:pt-8 px-4 sm:px-6 lg:px-8 pb-6">
                {/* Chat Area / Hero */}
                {messages && messages.length > 0 ? (
                    <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-8">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUpFade`}>
                                {msg.role !== 'user' && (
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-[#9D00FF] to-blue-600 flex items-center justify-center text-white mr-4 shrink-0 shadow-lg shadow-purple-500/20">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                )}

                                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} min-w-0`}>
                                    <div
                                        className={`${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-gray-700 to-gray-700 dark:from-white/80 dark:to-gray-200 text-white dark:text-black rounded-xl rounded-tr-sm p-4 md:p-5 shadow-xl shadow-gray-900/10 dark:shadow-white/5 w-full min-w-0'
                                            : 'bg-white/60 dark:bg-[#18181b]/80 backdrop-blur-md rounded-xl rounded-tl-sm p-5 md:p-6 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 shadow-sm w-full min-w-0'
                                            }`}
                                    >
                                        <div className="flex flex-col gap-3 min-w-0 w-full">
                                            {msg.imageUrl && (
                                                <img src={msg.imageUrl} alt="attachment" className="max-w-[100px] rounded-xl shadow-md border border-white/10" />
                                            )}
                                            {msg.generatedImageUrl && (
                                                <div className="relative group w-full max-w-sm md:max-w-md">
                                                    <img src={msg.generatedImageUrl} alt="generated" className="w-full rounded-2xl shadow-[0_0_30px_rgba(157,0,255,0.15)] border border-purple-500/20 block" />
                                                    <button
                                                        onClick={() => handleDownloadImage(msg.generatedImageUrl)}
                                                        className="absolute top-3 right-3 p-2.5 bg-black/40 hover:bg-black/70 rounded-full text-white/90 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg flex items-center justify-center transform hover:scale-105"
                                                        title="Download Image"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {msg.role === 'user' ? (
                                                <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
                                                    {msg.text}
                                                </div>
                                            ) : (
                                                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words text-[15px] leading-relaxed min-w-0 w-full prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-pre:my-0 prose-pre:p-0">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code: CodeBlockRenderer
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Deep Research Sources Card */}
                                    {msg.isDeepResearch && msg.sources?.length > 0 && (
                                        <DeepResearchSourcesCard sources={msg.sources} subQuestions={msg.subQuestions} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Deep Research In-Progress Panel */}
                        {isResearching && researchSteps.length > 0 && (
                            <div className="flex w-full justify-start items-start animate-slideUpFade">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-[#9D00FF] to-blue-600 flex items-center justify-center text-white mr-4 shrink-0 shadow-lg shadow-purple-500/20 mt-1">
                                    <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '2s' }} />
                                </div>
                                <div className="bg-white/80 dark:bg-[#18181b]/90 backdrop-blur-md rounded-3xl rounded-tl-sm p-5 border border-purple-200 dark:border-purple-500/30 shadow-lg shadow-purple-500/10 min-w-[260px] max-w-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                            <Search className="w-2.5 h-2.5 text-white" />
                                        </div>
                                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Deep Research in progress</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {researchSteps.map((step, i) => (
                                            <div key={step.id} className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${step.done
                                                    ? 'bg-green-500 text-white'
                                                    : i === researchSteps.findIndex(s => !s.done)
                                                        ? 'bg-purple-500 text-white animate-pulse'
                                                        : 'bg-gray-200 dark:bg-white/10 text-gray-400'
                                                    }`}>
                                                    {step.done ? (
                                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                    ) : i === researchSteps.findIndex(s => !s.done) ? (
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium transition-colors ${step.done ? 'text-green-600 dark:text-green-400 line-through opacity-70' :
                                                    i === researchSteps.findIndex(s => !s.done) ? 'text-gray-900 dark:text-white' :
                                                        'text-gray-400 dark:text-gray-600'
                                                    }`}>{step.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex gap-1">
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex-1 h-1 rounded-full bg-purple-200 dark:bg-purple-500/30 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"
                                                    style={{ animationDelay: `${i * 150}ms` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Regular loading dots */}
                        {isLoading && !isResearching && (
                            <div className="flex w-full justify-start items-center animate-slideUpFade">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-[#9D00FF] to-blue-600 flex items-center justify-center text-white mr-4 shrink-0 shadow-lg shadow-purple-500/20">
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                </div>
                                <div className="bg-white/60 dark:bg-[#18181b]/80 backdrop-blur-md rounded-3xl rounded-tl-sm p-5 border border-gray-200 dark:border-white/5 shadow-sm px-6 py-4 flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#9D00FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center mt-4 px-2">
                        {isTemporaryChat ? (
                            <div className="flex flex-col items-center max-w-2xl text-center animate-slideUpFade">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 dark:bg-[#1f1f1f] flex items-center justify-center mb-6 border border-gray-200 dark:border-white/10 shadow-lg">
                                    <MessageSquareDashed className="w-8 h-8 md:w-10 md:h-10 text-gray-700 dark:text-gray-300" />
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-center mb-4">
                                    <span className="text-gray-900 dark:text-white">
                                        Temporary chat
                                    </span>
                                </h1>
                                <p className="text-sm md:text-base text-gray-500 dark:text-[#9aa0a6] leading-relaxed mb-8 max-w-xl">
                                    Temporary chats don't appear in Recent chats or Activity and aren't used to train models or personalise your experience.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* <div className="relative mb-8 group cursor-default">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-2xl">
                                        <Sparkles className="w-12 h-12 md:w-14 md:h-14 text-[#9D00FF]" />
                                    </div>
                                </div> */}

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center mb-4">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-[#9D00FF] to-gray-900 dark:from-white dark:via-purple-400 dark:to-white">
                                        {greeting}
                                    </span>
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-12 text-center text-base md:text-lg max-w-xl">
                                    Unlock your creativity, solve complex problems, or just chat. Let's make something amazing together.
                                </p>

                                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-4xl mx-auto animate-slideUpFade" style={{ animationDelay: '0.1s' }}>
                                    {quickActions.map((action, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => { setInputValue(action.label); textareaRef.current?.focus(); }}
                                            className="group relative overflow-hidden flex flex-col items-start p-5 rounded-3xl bg-white/50 dark:bg-[#121212]/50 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(157,0,255,0.1)]"
                                        >
                                            <div className={`absolute top-0 left-0 w-full transition-opacity`}></div>
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4 group-hover:scale-110 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 shadow-sm relative z-10">
                                                {action.icon}
                                            </div>
                                            <span className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{action.label}</span>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{action.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Input Area */}
                <div className="mt-auto pt-4 relative animate-slideUpFade z-20" style={{ animationDelay: '0.2s' }}>

                    {/* Deep Research Panel */}
                    {isDeepResearchActive && (
                        <div className="mb-3 w-full mx-auto max-w-4xl">
                            <div className="bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl border border-purple-200 dark:border-purple-500/30 rounded-2xl shadow-lg shadow-purple-500/10 overflow-hidden">
                                {/* Panel Header */}
                                <div
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                                    onClick={() => setDeepResearchOpen(v => !v)}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                                            <Search className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-white">Deep Research</span>
                                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                                            <Zap className="w-3 h-3" />
                                            {researchDepth}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="hidden sm:flex items-center gap-1.5">
                                            {Object.entries(researchSources).filter(([, v]) => v).map(([k]) => (
                                                <span key={k} className="text-[10px] font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{k}</span>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setActiveTool(null); setDeepResearchOpen(false); }}
                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Disable Deep Research"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        {deepResearchOpen
                                            ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                            : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </div>
                                </div>

                                {/* Expanded Settings */}
                                {deepResearchOpen && (
                                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-white/5">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Depth Selector */}
                                            <div className="flex-1">
                                                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Research Depth</p>
                                                <div className="flex gap-2">
                                                    {[
                                                        { id: 'Quick', icon: <Zap className="w-3.5 h-3.5" />, desc: 'Fast scan' },
                                                        { id: 'Balanced', icon: <Scale className="w-3.5 h-3.5" />, desc: 'Thorough' },
                                                        { id: 'Deep', icon: <Layers className="w-3.5 h-3.5" />, desc: 'Exhaustive' },
                                                    ].map(({ id, icon, desc }) => (
                                                        <button
                                                            key={id}
                                                            type="button"
                                                            onClick={() => setResearchDepth(id)}
                                                            className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-center transition-all duration-200 ${researchDepth === id
                                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10'
                                                                : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50/50 dark:hover:bg-purple-500/10'
                                                                }`}
                                                        >
                                                            <span className={researchDepth === id ? 'text-purple-600 dark:text-purple-400' : ''}>{icon}</span>
                                                            <span className="text-xs font-semibold">{id}</span>
                                                            <span className="text-[10px] opacity-70">{desc}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Source Toggles */}
                                            <div className="flex-1">
                                                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sources</p>
                                                <div className="flex gap-2">
                                                    {[
                                                        { id: 'Web', icon: <Globe className="w-3.5 h-3.5" /> },
                                                        { id: 'Academic', icon: <BookOpen className="w-3.5 h-3.5" /> },
                                                        { id: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
                                                    ].map(({ id, icon }) => {
                                                        const active = researchSources[id];
                                                        return (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => setResearchSources(prev => ({ ...prev, [id]: !prev[id] }))}
                                                                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-center transition-all duration-200 ${active
                                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10'
                                                                    : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/10'
                                                                    }`}
                                                            >
                                                                <span className={active ? 'text-blue-600 dark:text-blue-400' : ''}>{icon}</span>
                                                                <span className="text-xs font-semibold">{id}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                                            Deep Research will conduct a comprehensive multi-step analysis, gather information from selected sources, and provide a well-structured report with key insights and conclusions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div
                        ref={menuRootRef}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative w-full mx-auto max-w-4xl bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl rounded-[2rem] flex flex-col gap-2 transition-all p-2 sm:p-3 ${isDragOver
                            ? 'border-2 border-dashed border-[#9D00FF] bg-purple-50 dark:bg-[#9D00FF]/10 shadow-[0_0_30px_rgba(157,0,255,0.2)]'
                            : 'border border-gray-200/80 dark:border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500/50'
                            }`}
                    >
                        {isDragOver && (
                            <div className="absolute inset-0 rounded-[2rem] flex items-center justify-center z-10 pointer-events-none bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                <p className="text-base font-bold text-purple-600 dark:text-purple-400">Release to drop files here</p>
                            </div>
                        )}

                        {attachments.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 px-2 scrollbar-hide">
                                {attachments.map((att) => (
                                    <div key={att.id} className="relative flex items-center gap-3 bg-gray-100 dark:bg-[#27272a] border border-gray-200 dark:border-white/5 rounded-2xl px-3 py-2 min-w-[200px] shadow-sm animate-popIn">
                                        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-black/40 overflow-hidden flex items-center justify-center shrink-0">
                                            {att.previewUrl ? (
                                                <img src={att.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <FileIcon className="w-5 h-5 text-gray-500 dark:text-white/70" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{att.file.name}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">{att.kind}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(att.id)}
                                            className="ml-1 flex items-center justify-center w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-red-500/20 text-gray-600 dark:text-white/70 hover:text-red-500 transition-colors shrink-0"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Active Tool Badge */}
                        {isDeepResearchActive && (
                            <div className="flex items-center gap-2 px-3 pt-2 pb-0">
                                <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full animate-popIn">
                                    <Search className="w-3 h-3" />
                                    <span>Deep Research</span>
                                    <span className="text-purple-400 dark:text-purple-500">·</span>
                                    <span className="text-purple-500 dark:text-purple-400">{researchDepth}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDeepResearchOpen(v => !v)}
                                    className="text-[11px] text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline underline-offset-2"
                                >
                                    {deepResearchOpen ? 'hide settings' : 'settings'}
                                </button>
                            </div>
                        )}

                        <div className="flex items-end gap-2">
                            {/* Left Controls */}
                            <div className="flex items-center gap-1 sm:gap-2 pb-1 pl-1">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setOpenMenu((v) => (v === 'plus' ? null : 'plus'))}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${openMenu === 'plus' ? 'bg-purple-100 dark:bg-purple-500/20 rotate-90 shadow-lg text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-[#27272a] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3f3f46]'}`}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>

                                    {openMenu === 'plus' && (
                                        <div className="absolute bottom-full left-0 mb-3 z-50 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-2xl p-2 w-[200px] shadow-2xl animate-scaleIn origin-bottom-left">
                                            {plusMenuItems.map((item) => (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors text-left font-medium"
                                                    onClick={() => handlePlusMenuItemClick(item.label)}
                                                >
                                                    <span className="text-purple-600 dark:text-purple-400">{item.icon}</span>
                                                    <span className="text-sm">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text Input */}
                            <textarea
                                ref={textareaRef}
                                rows="1"
                                placeholder={getInputPlaceholder()}
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                className="flex-1 w-full bg-transparent border-none outline-none text-[15px] sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white resize-none overflow-y-auto custom-scrollbar font-medium py-3 px-2 sm:px-4 max-h-[200px]"
                            />

                            {/* Right Controls */}
                            <div className="flex items-center gap-2 pb-1 pr-1">
                                {inputValue.trim() || attachments.length > 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors shadow-lg animate-popIn"
                                    >
                                        <SendHorizontal className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setOpenMenu((v) => (v === 'tools' ? null : 'tools'))}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${openMenu === 'tools' || activeTool ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-[#27272a] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3f3f46]'}`}
                                        >
                                            {activeTool ? activeTool.icon : <SlidersHorizontal className="w-5 h-5" />}
                                        </button>

                                        {openMenu === 'tools' && (
                                            <div className="absolute bottom-full right-0 mb-3 z-50 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-2xl p-2 w-[240px] shadow-2xl animate-scaleIn origin-bottom-right">
                                                {toolsMenuItems.map((item) => {
                                                    const isActive = activeTool?.label === item.label;
                                                    return (
                                                        <button
                                                            key={item.label}
                                                            type="button"
                                                            disabled={item.disabled}
                                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left font-medium ${item.disabled ? 'opacity-60 cursor-not-allowed' : isActive ? 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'}`}
                                                            onClick={() => {
                                                                if (item.disabled) return;
                                                                const nextTool = isActive ? null : item;
                                                                setActiveTool(nextTool);
                                                                setOpenMenu(null);
                                                                if (nextTool?.label === 'Deep Research') {
                                                                    setDeepResearchOpen(true);
                                                                } else {
                                                                    setDeepResearchOpen(false);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className={item.disabled ? 'text-gray-500 dark:text-gray-400' : isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}>{item.icon}</span>
                                                                <span className={`text-sm whitespace-nowrap ${item.disabled ? 'text-gray-600 dark:text-gray-300' : ''}`}>{item.label}</span>
                                                            </div>
                                                            {item.disabled && (
                                                                <span className="text-[9px] shrink-0 font-bold tracking-wider uppercase bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded h-fit">Soon</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                        <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
