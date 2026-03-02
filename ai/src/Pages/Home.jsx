import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt } from '../redux/slice/chat.slice';
import { Mic, Plus, SlidersHorizontal, ChevronDown, Search, Image as ImageIcon, LayoutPanelTop, GraduationCap, Upload, FolderOpen, Images, File as FileIcon, X, SendHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
    const toolsButtonRef = useRef(null);
    const plusButtonRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Thinking');
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const photoInputRef = useRef(null);
    const [attachments, setAttachments] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const dispatch = useDispatch();
    const modelButtonRef = useRef(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

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
            { label: 'Create images', icon: <ImageIcon className="w-4 h-4" /> },
            { label: 'Canvas', icon: <LayoutPanelTop className="w-4 h-4" /> },
            { label: 'Guided Learning', icon: <GraduationCap className="w-4 h-4" /> },
        ],
        []
    );

    const modelOptions = [
        { name: 'Fast', desc: 'Answers quickly' },
        { name: 'Thinking', desc: 'Solves complex problems' },
        { name: 'Pro', desc: 'Advanced math and code with 3.1 Pro' },
    ];

    const plusMenuItems = useMemo(
        () => [
            { label: 'Upload files', icon: <Upload className="w-4 h-4" /> },
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
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

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

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop?.();
            recognitionRef.current = null;
        };
    }, []);

    const quickActions = [
        { label: 'Create image', emoji: '🎨' },
        { label: 'Explore cricket', emoji: '🏏' },
        { label: 'Create music', emoji: '🎸' },
        { label: 'Help me learn', emoji: '📚' },
        { label: 'Write anything', emoji: '✍️' },
        { label: 'Boost my day', emoji: '✨' },
    ];

    const handlePlusMenuItemClick = (label) => {
        if (label === 'Upload files') {
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
                            id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
                            file,
                            kind: 'photo',
                            previewUrl: reader.result,
                            base64: reader.result
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    resolve({
                        id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
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

    const handleFileChange = (event, type) => {
        const files = Array.from(event.target.files || []);
        addFilesToAttachments(files);
        event.target.value = '';
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) setIsDragOver(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        addFilesToAttachments(files);
    };

    const handleRemoveAttachment = (id) => {
        setAttachments((prev) => {
            const target = prev.find((att) => att.id === id);
            if (target?.previewUrl && target.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter((att) => att.id !== id);
        });
    };

    const getInputPlaceholder = () => {
        if (!activeTool) return 'Ask vsinfotech AI';

        switch (activeTool.label) {
            case 'Deep Research':
                return 'Ask vsinfotech AI to do deep research on anything';
            case 'Create images':
                return 'Ask vsinfotech AI to create an image';
            case 'Canvas':
                return 'Ask vsinfotech AI to brainstorm on a canvas';
            case 'Guided Learning':
                return 'Ask vsinfotech AI to create a guided learning plan';
            default:
                return 'Ask vsinfotech AI';
        }
    };

    return (
        <main className="flex-1 flex flex-col px-4 lg:px-12 pb-10 transition-colors duration-300 overflow-hidden">
            <div className="w-full max-w-3xl mx-auto flex flex-col h-full pt-2 sm:pt-6">
                {messages && messages.length > 0 ? (
                    <div className="flex-1 overflow-y-auto mb-6 bg-transparent scrollbar-hide flex flex-col gap-6 pr-2 mt-4 sm:mt-0">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3 shrink-0 mt-1">
                                        <span className="text-sm">✨</span>
                                    </div>
                                )}

                                <div
                                    className={`${msg.role === 'user'
                                        ? 'bg-gray-100 dark:bg-[#1f1f20] rounded-3xl p-4 md:p-6 text-black dark:text-white border border-gray-200 dark:border-white/10 shadow-sm max-w-[85%]'
                                        : 'bg-transparent max-w-[85%] text-black dark:text-[#e3e3e3]'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <div className="flex flex-col gap-2">
                                            {msg.imageUrl && (
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="attachment"
                                                    className="max-w-[200px] rounded-lg"
                                                />
                                            )}
                                            <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-sans">
                                                {msg.text}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose dark:prose-invert max-w-none break-words text-[15px] leading-7">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '');

                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                {...props}
                                                                style={dracula}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                className="rounded-lg !my-4 text-sm"
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code
                                                                {...props}
                                                                className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400"
                                                            >
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
                        ))}
                        {isLoading && (
                            <div className="flex w-full justify-start items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3 shrink-0">
                                    {user?.picture ? (
                                        <img src={user.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : user?.name ? (
                                        <span className="text-sm uppercase">{user.name.charAt(0)}</span>
                                    ) : (
                                        <span className="text-sm">✨</span>
                                    )}
                                </div>
                                <div className="px-5 py-3 flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#9D00FF]/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-[#9D00FF]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-[#9D00FF]/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        {/* Invisible div to scroll to bottom */}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center mt-10 md:mt-20 px-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#9D00FF]/10 dark:bg-[#9D00FF]/20 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_30px_rgba(157,0,255,0.3)]">
                            <span className="text-3xl md:text-4xl text-[#9D00FF]">✨</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#9D00FF] to-gray-900 dark:from-white dark:via-[#9D00FF] dark:to-white transition-colors animate-slideUpFade pb-2 text-center" style={{ lineHeight: '1.2' }}>How can I help you today?</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-10 text-center text-sm md:text-base max-w-lg">
                            Ask me anything, or pick one of these suggestions to get started.
                        </p>

                        {/* Quick Action Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mx-auto animate-slideUpFade" style={{ animationDelay: '0.2s' }}>
                            {quickActions.slice(0, 4).map((action, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => { setInputValue(action.label); textareaRef.current?.focus(); }}
                                    className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 hover:border-[#9D00FF]/50 dark:hover:border-[#9D00FF]/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(157,0,255,0.15)] cursor-pointer transition-all group hover:-translate-y-1"
                                >
                                    <span className="text-2xl mb-3 group-hover:scale-110 transition-transform">{action.emoji}</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#9D00FF] transition-colors">{action.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 md:mt-8 animate-slideUpFade" style={{ animationDelay: '0.1s' }}>
                    <div
                        ref={menuRootRef}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative bg-white dark:bg-[#121212] rounded-[32px] flex flex-col gap-2 transition-all shadow-inner-custom ${isDragOver
                            ? 'border-[#9D00FF] border-[3px] border-dashed bg-[#9D00FF]/5 dark:bg-[#9D00FF]/5 drop-shadow-[0_0_15px_rgba(157,0,255,0.2)]'
                            : 'border border-gray-200 dark:border-gray-800 focus-within:border-[#9D00FF] focus-within:ring-4 focus-within:ring-[#9D00FF]/10 dark:focus-within:ring-[#9D00FF]/20'
                            }`}
                    >
                        {isDragOver && (
                            <div className="absolute inset-0 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center z-10 pointer-events-none">
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Drop files or images here</p>
                            </div>
                        )}
                        {attachments.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {attachments.map((att) => (
                                    <div key={att.id} className="relative flex items-center gap-3 bg-[#171819] border border-white/10 rounded-2xl px-3 py-2 min-w-[220px]">
                                        <div className="w-9 h-9 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center shrink-0">
                                            {att.previewUrl ? (
                                                <img src={att.previewUrl} alt="Attachment preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <FileIcon className="w-4 h-4 text-white/80" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{att.file.name}</p>
                                            <p className="text-[10px] text-gray-600 dark:text-white/60 capitalize">{att.kind === 'photo' ? 'Photo' : 'File'}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(att.id)}
                                            className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors shrink-0"
                                            aria-label="Remove attachment"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <textarea
                            ref={textareaRef}
                            rows="1"
                            placeholder={getInputPlaceholder()}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="flex-1 w-full bg-transparent border-none outline-none text-[15px] md:text-base placeholder:text-gray-400 dark:placeholder:text-[#6a6a6a] text-gray-900 dark:text-white transition-colors resize-none overflow-y-auto custom-scrollbar font-medium py-2.5 px-3"
                            style={{ minHeight: '28px', maxHeight: '250px' }}
                        />

                        <div className="flex items-center gap-2 bg-transparent pl-3 pr-1 pt-1">
                            <div className="relative">
                                <button ref={plusButtonRef} type="button"
                                    onClick={() => setOpenMenu((v) => (v === 'plus' ? null : 'plus'))}
                                    aria-haspopup="menu"
                                    aria-expanded={openMenu === 'plus'}
                                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${openMenu === 'plus' ? 'bg-[#9D00FF] text-white rotate-45 scale-110 shadow-md' : 'text-gray-500 dark:text-[#a0a09e] hover:text-[#9D00FF] dark:hover:text-[#9D00FF]'}`}
                                    title="Add"
                                >
                                    <Plus className="w-5 h-5 transition-transform duration-300" />
                                </button>

                                {openMenu === 'plus' && (
                                    <div role="menu" aria-label="Add menu" className="absolute bottom-[120%] left-0 mb-2 z-50 glass-card rounded-2xl py-2 w-[220px] shadow-2xl animate-scaleIn border border-gray-200 dark:border-white/10">
                                        {plusMenuItems.map((item) => (
                                            <button
                                                key={item.label}
                                                type="button"
                                                role="menuitem"
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors text-left"
                                                onClick={() => handlePlusMenuItemClick(item.label)}
                                            >
                                                <span className="text-gray-500 dark:text-white/80">{item.icon}</span>
                                                <span className="text-sm">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button ref={toolsButtonRef} type="button"
                                    onClick={() => setOpenMenu((v) => (v === 'tools' ? null : 'tools'))}
                                    aria-haspopup="menu"
                                    aria-expanded={openMenu === 'tools'}
                                    className={`inline-flex items-center gap-2 text-[12px] md:text-sm transition-colors rounded-full px-4 py-2 font-medium border ${openMenu === 'tools' || activeTool ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-white/10' : 'text-gray-600 dark:text-white/70 border-transparent hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    <span className="flex items-center justify-center w-6 h-6">
                                        {activeTool ? (
                                            React.cloneElement(activeTool.icon, { className: 'w-3.5 h-3.5' })
                                        ) : (
                                            <SlidersHorizontal className="w-3.5 h-3.5" />
                                        )}
                                    </span>
                                    <span>{activeTool ? activeTool.label : 'Tools'}</span>
                                </button>

                                {openMenu === 'tools' && (
                                    <div role="menu" aria-label="Tools menu" className="absolute bottom-[120%] right-0 mb-2 z-50 glass-card border border-gray-200 dark:border-white/10 rounded-2xl py-2 w-[240px] shadow-2xl animate-scaleIn">
                                        {toolsMenuItems.map((item) => {
                                            const isActive = activeTool?.label === item.label;
                                            return (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    role="menuitem"
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left ${isActive ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white/90 hover:text-black dark:hover:text-white'}`}
                                                    onClick={() => {
                                                        if (isActive) {
                                                            setActiveTool(null);
                                                        } else {
                                                            setActiveTool(item);
                                                        }
                                                        setOpenMenu(null);
                                                    }}
                                                >
                                                    <span className={isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/80'}>{item.icon}</span>
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 ml-auto">
                                {inputValue.trim() || attachments.length > 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors animate-popIn"
                                        title="Send message"
                                    >
                                        <SendHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>

                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFileChange(e, 'files')} />
                        <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'photos')} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
