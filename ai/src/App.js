import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Sidebar from './Pages/Sidebar';
import Header from './Pages/Header';
import { Mic, Plus, SlidersHorizontal, ChevronDown, Search, Image as ImageIcon, LayoutPanelTop, GraduationCap, Upload, FolderOpen, Images } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

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
  const menuRootRef = useRef(null);
  const toolsButtonRef = useRef(null);
  const plusButtonRef = useRef(null);

  const toolsMenuItems = useMemo(
    () => [
      { label: 'Deep Research', icon: <Search className="w-4 h-4" /> },
      { label: 'Create images', icon: <ImageIcon className="w-4 h-4" /> },
      { label: 'Canvas', icon: <LayoutPanelTop className="w-4 h-4" /> },
      { label: 'Guided Learning', icon: <GraduationCap className="w-4 h-4" /> },
    ],
    []
  );

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

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex bg-white dark:bg-[#131314] text-black dark:text-white transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-white dark:bg-[#131314] transition-colors duration-300">
          <Header />
          <main className="flex-1 flex items-end justify-center px-4 lg:px-12 pb-10 lg:pb-16 transition-colors duration-300">
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 dark:text-[#c4c7c5] mb-1 transition-colors">
                <span className="text-lg">✨</span>
                <p>Hi umang jogani</p>
              </div>
              <h1 className="text-[1.8rem] md:text-3xl lg:text-4xl font-semibold tracking-tight bg-gradient-to-r from-themedark via-black to-gray-500 dark:from-white dark:via-white dark:to-[#9ca3af] bg-clip-text text-transparent transition-colors">Where should we start?</h1>

              <div className="mt-6 md:mt-8">
                <div ref={menuRootRef} className="bg-gray-100 dark:bg-[#1f1f20] rounded-3xl px-4 py-3 md:px-6 md:py-4 border border-gray-200 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] flex flex-col gap-3 transition-colors">
                  <input type="text" placeholder="Ask Gemini 3" className="w-full bg-transparent border-none outline-none text-sm md:text-base placeholder:text-gray-400 dark:placeholder:text-[#9ba0a6] text-gray-900 dark:text-white transition-colors" />

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
                          <div role="menu" aria-label="Add menu" className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-white/10 rounded-2xl py-2 w-[220px] shadow-lg dark:shadow-2xl">
                            {plusMenuItems.map((item) => (
                              <button key={item.label} type="button" role="menuitem" className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors text-left" onClick={() => setOpenMenu(null)}>
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
                          className={`inline-flex items-center gap-2 text-[11px] md:text-xs hover:text-black dark:hover:text-white transition-colors rounded-full px-2 py-1.5 ${openMenu === 'tools' ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white' : ''}`}
                        >
                          <span className="flex items-center justify-center w-6 h-6">
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </span>
                          <span>Tools</span>
                        </button>

                        {openMenu === 'tools' && (
                          <div role="menu" aria-label="Tools menu" className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-white/10 rounded-2xl py-2 w-[240px] shadow-lg dark:shadow-2xl">
                            {toolsMenuItems.map((item) => (
                              <button key={item.label} type="button" role="menuitem" className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors text-left" onClick={() => setOpenMenu(null)}>
                                <span className="text-gray-500 dark:text-white/80">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="hidden sm:inline-flex items-center gap-1 md:gap-1.5 text-[11px] md:text-xs hover:text-black dark:hover:text-white transition-colors">
                        <span>Thinking</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors">
                        <Mic className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
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
