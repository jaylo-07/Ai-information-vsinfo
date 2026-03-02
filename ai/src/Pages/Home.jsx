import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt } from '../redux/slice/chat.slice';
import { Plus, SlidersHorizontal, Search, Image as ImageIcon, LayoutPanelTop, GraduationCap, Upload, Images, File as FileIcon, X, SendHorizontal, Sparkles, Paintbrush, BarChart3, Code2, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Home = () => {
    const messages = useSelector((state) => state.chat.messages);
    const isLoading = useSelector((state) => state.chat.isLoading);
    const user = useSelector((state) => state.auth?.user);

    const [openMenu, setOpenMenu] = useState(null);
    const [activeTool, setActiveTool] = useState(null);
    const menuRootRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);

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

        let imageUrl = null;
        const imageAttachment = attachments.find(att => att.kind === 'photo');
        if (imageAttachment) {
            imageUrl = imageAttachment.base64;
        }

        dispatch(sendPrompt({ prompt: inputValue, imageUrl }));
        setInputValue('');
        setAttachments([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
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
            { label: 'Deep Research', icon: <Search className="w-4 h-4" /> },
            { label: 'Create Images', icon: <ImageIcon className="w-4 h-4" /> },
            { label: 'Canvas', icon: <LayoutPanelTop className="w-4 h-4" /> },
            { label: 'Guided Learning', icon: <GraduationCap className="w-4 h-4" /> },
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

                                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black rounded-3xl rounded-tr-sm p-4 md:p-5 shadow-xl shadow-gray-900/10 dark:shadow-white/5'
                                            : 'bg-white/60 dark:bg-[#18181b]/80 backdrop-blur-md rounded-3xl rounded-tl-sm p-5 md:p-6 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex flex-col gap-3">
                                            {msg.imageUrl && (
                                                <img src={msg.imageUrl} alt="attachment" className="max-w-[240px] md:max-w-[300px] rounded-xl shadow-md border border-white/10" />
                                            )}
                                            {msg.role === 'user' ? (
                                                <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
                                                    {msg.text}
                                                </div>
                                            ) : (
                                                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words text-[15px] leading-7">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ inline, className, children, ...props }) {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                return !inline && match ? (
                                                                    <div className="rounded-xl overflow-hidden my-4 border border-gray-200 dark:border-white/10 shadow-lg">
                                                                        <div className="px-4 py-2 bg-gray-100 dark:bg-[#121212] text-xs font-mono text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                                                                            <span>{match[1]}</span>
                                                                        </div>
                                                                        <SyntaxHighlighter {...props} style={dracula} language={match[1]} PreTag="div" className="!m-0 !bg-[#1e1e1e] text-sm">
                                                                            {String(children).replace(/\n$/, '')}
                                                                        </SyntaxHighlighter>
                                                                    </div>
                                                                ) : (
                                                                    <code {...props} className="bg-gray-100 dark:bg-gray-800 rounded-md px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400">
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
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
                        <div className="relative mb-8 group cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-12 h-12 md:w-14 md:h-14 text-[#9D00FF]" />
                            </div>
                        </div>

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
                    </div>
                )}

                {/* Input Area */}
                <div className="mt-auto pt-4 relative animate-slideUpFade z-20" style={{ animationDelay: '0.2s' }}>
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

                        <div className="flex items-end gap-2">
                            {/* Left Controls */}
                            <div className="flex items-center gap-1 sm:gap-2 pb-1 pl-1">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setOpenMenu((v) => (v === 'plus' ? null : 'plus'))}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${openMenu === 'plus' ? 'bg-[#9D00FF] text-white rotate-90 shadow-lg shadow-purple-500/30' : 'bg-gray-100 dark:bg-[#27272a] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3f3f46]'}`}
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
                                            <div className="absolute bottom-full right-0 mb-3 z-50 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-2xl p-2 w-[220px] shadow-2xl animate-scaleIn origin-bottom-right">
                                                {toolsMenuItems.map((item) => {
                                                    const isActive = activeTool?.label === item.label;
                                                    return (
                                                        <button
                                                            key={item.label}
                                                            type="button"
                                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left font-medium ${isActive ? 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'}`}
                                                            onClick={() => {
                                                                setActiveTool(isActive ? null : item);
                                                                setOpenMenu(null);
                                                            }}
                                                        >
                                                            <span className={isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}>{item.icon}</span>
                                                            <span className="text-sm">{item.label}</span>
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
