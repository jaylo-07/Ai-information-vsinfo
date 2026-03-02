import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt } from './redux/slice/chat.slice';
import './App.css';
import Sidebar from './Pages/Sidebar';
import Header from './Pages/Header';
import { Mic, Plus, SlidersHorizontal, ChevronDown, Search, Image as ImageIcon, LayoutPanelTop, GraduationCap, Upload, FolderOpen, Images, File as FileIcon, X, SendHorizontal } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const theme = useSelector((state) => state.chat.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'Dark') {
      root.classList.add('dark');
    } else if (theme === 'Light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Optionally, listen for OS theme changes for 'System'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (theme === 'System') {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

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
  const dispatch = useDispatch();
  const modelButtonRef = useRef(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    dispatch(sendPrompt(inputValue));
    setInputValue('');
  };

  const user = useSelector((state) => state.auth.user);

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

  const topRow = quickActions.slice(0, 4);
  const bottomRow = quickActions.slice(4);

  const handlePlusMenuItemClick = (label) => {
    if (label === 'Upload files') {
      fileInputRef.current?.click();
    } else if (label === 'Photos') {
      photoInputRef.current?.click();
    }
    setOpenMenu(null);
  };

  const handleFileChange = (event, type) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newAttachments = files.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        kind: type === 'photos' || isImage ? 'photo' : 'file',
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);

    event.target.value = '';
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((att) => att.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((att) => att.id !== id);
    });
  };

  const getInputPlaceholder = () => {
    if (!activeTool) return 'Ask Gemini 3';

    switch (activeTool.label) {
      case 'Deep Research':
        return 'Ask Gemini 3 to do deep research on anything';
      case 'Create images':
        return 'Ask Gemini 3 to create an image';
      case 'Canvas':
        return 'Ask Gemini 3 to brainstorm on a canvas';
      case 'Guided Learning':
        return 'Ask Gemini 3 to create a guided learning plan';
      default:
        return 'Ask Gemini 3';
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex bg-white dark:bg-[#131314] text-black dark:text-white transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-white dark:bg-[#131314] transition-colors duration-300">
          <Header />
          <main className="flex-1 flex items-end justify-center px-4 lg:px-12 pb-10 transition-colors duration-300">
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-sm md:text-base text-[#c4c7c5] mb-1">
                <span className="text-lg">✨</span>
                <p>Hi {user?.name || 'Guest'}</p>
              </div>
              <h1 className="text-[1.8rem] md:text-3xl lg:text-4xl font-semibold tracking-tight bg-gradient-to-r from-themedark via-black to-gray-500 dark:from-white dark:via-white dark:to-[#9ca3af] bg-clip-text text-transparent transition-colors animate-slideUpFade">Where should we start?</h1>

              <div className="mt-6 md:mt-8 animate-slideUpFade" style={{ animationDelay: '0.1s' }}>
                <div ref={menuRootRef} className="bg-gray-100 dark:bg-[#1f1f20] rounded-3xl px-4 py-3 md:px-6 md:py-4 border border-gray-200 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] flex flex-col gap-3 transition-colors hover:shadow-lg dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
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
                            <p className="text-xs font-medium text-white truncate">{att.file.name}</p>
                            <p className="text-[10px] text-white/60 capitalize">{att.kind === 'photo' ? 'Photo' : 'File'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
                            aria-label="Remove attachment"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder={getInputPlaceholder()}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-transparent border-none outline-none text-sm md:text-base placeholder:text-gray-400 dark:placeholder:text-[#9ba0a6] text-gray-900 dark:text-white transition-colors"
                  />

                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-[#c4c7c5]">
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <button ref={plusButtonRef} type="button"
                          onClick={() => setOpenMenu((v) => (v === 'plus' ? null : 'plus'))}
                          aria-haspopup="menu"
                          aria-expanded={openMenu === 'plus'}
                          className={`inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${openMenu === 'plus' ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white' : ''}`}
                          title="Add"
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        {openMenu === 'plus' && (
                          <div role="menu" aria-label="Add menu" className="absolute bottom-full left-0 mb-2 z-50 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-white/10 rounded-2xl py-2 w-[220px] shadow-lg dark:shadow-2xl">
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
                          className={`inline-flex items-center gap-2 text-[11px] md:text-xs hover:text-black dark:hover:text-white transition-colors rounded-full px-2 py-1.5 ${openMenu === 'tools' || activeTool ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white' : ''}`}
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
                          <div role="menu" aria-label="Tools menu" className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-white/10 rounded-2xl py-2 w-[240px] shadow-lg dark:shadow-2xl">
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
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          ref={modelButtonRef}
                          type="button"
                          onClick={() => setOpenMenu((v) => (v === 'model' ? null : 'model'))}
                          className="hidden sm:inline-flex items-center gap-1 md:gap-1.5 text-[11px] md:text-xs hover:text-black dark:hover:text-white transition-colors"
                        >
                          <span>{selectedModel}</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {openMenu === 'model' && (
                          <div role="menu" aria-label="Model menu" className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-white/10 rounded-2xl py-3 w-[280px] shadow-lg dark:shadow-2xl animate-scaleIn">
                            <p className="px-4 text-[13px] font-medium text-gray-900 dark:text-white mb-2">Gemini 3</p>
                            {modelOptions.map((item) => (
                              <button
                                key={item.name}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setSelectedModel(item.name);
                                  setOpenMenu(null);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left ${selectedModel === item.name ? 'bg-black/5 dark:bg-white/10' : ''}`}
                              >
                                <div className="flex flex-col">
                                  <span className={`text-[14px] ${selectedModel === item.name ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white/90'}`}>{item.name}</span>
                                  <span className="text-[12px] text-gray-500 dark:text-white/60">{item.desc}</span>
                                </div>
                                {selectedModel === item.name && (
                                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {inputValue.trim() ? (
                        <button
                          type="button"
                          onClick={handleSend}
                          className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors animate-popIn"
                          title="Send message"
                        >
                          <SendHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const recognition = recognitionRef.current;
                            if (!recognition) {
                              toast.error('Speech recognition is not supported in this browser.');
                              return;
                            }

                            if (isListening) {
                              recognition.stop();
                              setIsListening(false);
                            } else {
                              try {
                                recognition.start();
                                setIsListening(true);
                              } catch {
                                setIsListening(false);
                              }
                            }
                          }}
                          className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-colors animate-popIn ${isListening
                            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200'
                            }`}
                          aria-pressed={isListening}
                          title={isListening ? 'Stop voice input' : 'Start voice input'}
                        >
                          <Mic className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFileChange(e, 'files')} />
                  <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'photos')} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
