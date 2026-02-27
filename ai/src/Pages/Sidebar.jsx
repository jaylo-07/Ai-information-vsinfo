import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Plus, MessageSquare, HelpCircle, History, Settings,
  Link, Sun, CreditCard, BookOpen, MessageSquarePlus,
  ChevronRight, MapPin, Check, Sparkles, Box, X, Shield, MoreVertical,
  Share2, Pin, Edit2, Trash2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt, setRecentPromptSafe, newChat, setTheme, setIsMobileSidebarOpen } from '../redux/slice/chat.slice';

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(null); // Track which chat menu is open

  const settingsRef = useRef(null);
  const chatMenuRef = useRef(null);

  const dispatch = useDispatch();
  const { prevPrompts, theme, isMobileSidebarOpen } = useSelector((state) => state.chat);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
        setShowThemeMenu(false);
        setShowHelpMenu(false);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
        setShowChatMenu(null);
      }
    };

    if (showSettings || showChatMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings, showChatMenu]);

  const loadPrompt = async (prompt) => {
    dispatch(setRecentPromptSafe(prompt));
    await dispatch(sendPrompt(prompt));
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => dispatch(setIsMobileSidebarOpen(false))}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <div className={`
                fixed lg:relative inset-y-0 left-0 z-50 
                flex flex-col justify-between bg-[#1e1f20] p-4 
                transition-all duration-300 font-sans overflow-visible
                ${isMobileSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}
                ${extended ? 'lg:w-[280px]' : 'lg:w-[72px]'}
            `}>

        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between lg:justify-start">
            <div onClick={() => setExtended(prev => !prev)} className="hidden lg:flex cursor-pointer hover:bg-white/10 rounded-full w-10 h-10 items-center justify-center transition-colors">
              <Menu className="w-5 h-5 text-[#c4c7c5]" />
            </div>
            <div onClick={() => dispatch(setIsMobileSidebarOpen(false))} className="lg:hidden cursor-pointer hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-[#c4c7c5]" />
            </div>
          </div>

          <div onClick={() => dispatch(newChat())} className={`mt-[40px] inline-flex items-center gap-3 bg-transparent hover:bg-white/5 py-2.5 px-4 rounded-full text-sm cursor-pointer transition-colors border border-[#444746] ${extended ? 'pr-8 max-w-[160px]' : 'px-0 w-10 h-10 justify-center'}`}>
            <Plus className="w-5 h-5 text-[#c4c7c5] shrink-0" />
            {extended && <p className="text-[#c4c7c5] font-medium whitespace-nowrap">New chat</p>}
          </div>

          {extended && (
            <div className="flex flex-col mt-8 animate-fadeIn">
              <p className="mb-4 text-sm px-1 font-semibold text-white">Recent</p>
              <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto scrollbar-hidden">
                {(!prevPrompts || prevPrompts.length === 0) && (
                  <p className="px-4 text-[13px] text-[#8e918f] italic">No recent chats</p>
                )}
                {prevPrompts && [...prevPrompts].reverse().map((item, index) => {
                  return (
                    <div key={index} className="relative flex items-center gap-3 p-1 pl-2 rounded-full hover:bg-white/10 hover:text-white cursor-pointer transition-colors text-[#c4c7c5] group">
                      <p onClick={() => loadPrompt(item)} className="text-sm truncate w-full">{item}</p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowChatMenu(showChatMenu === index ? null : index);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-full transition-all relative"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </div>

                      {/* Chat Context Menu */}
                      {showChatMenu === index && (
                        <div
                          ref={chatMenuRef}
                          className="absolute right-0 top-8 bg-[#1e1f20] border border-[#444746] rounded-xl py-2 w-[200px] shadow-2xl z-50 animate-fadeIn"
                        >
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-white transition-colors text-left">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">Share conversation</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-white transition-colors text-left">
                            <Pin className="w-4 h-4" />
                            <span className="text-sm">Pin</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-white transition-colors text-left">
                            <Edit2 className="w-4 h-4" />
                            <span className="text-sm">Rename</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-[#f87171] transition-colors text-left">
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2 relative mt-auto" ref={settingsRef}>

          {/* Settings Dropdown Menu */}
          {showSettings && (
            <div
              onMouseLeave={() => setShowThemeMenu(false)}
              className={`absolute bottom-full mb-4 left-0 bg-[#1e1f20] border border-[#444746] rounded-2xl p-2 w-[280px] shadow-2xl z-50 animate-fadeIn`}
            >
              <div className="flex flex-col relative">
                <DropdownItem icon={<History className="w-5 h-5" />} label="Activity" />
                <DropdownItem icon={<Sparkles className="w-5 h-5" />} label="Instructions for Nexus" dot />
                <DropdownItem icon={<Box className="w-5 h-5" />} label="Connected apps" dot />
                <DropdownItem icon={<Link className="w-5 h-5" />} label="Your public links" />

                <hr className="border-[#444746] my-2" />

                <div
                  onMouseEnter={() => {
                    setShowThemeMenu(true);
                    setShowHelpMenu(false);
                  }}
                  onMouseLeave={() => setShowThemeMenu(false)}
                  className="relative"
                >
                  <DropdownItem
                    icon={<Sun className="w-5 h-5" />}
                    label="Theme"
                    hasChevron
                    isActive={showThemeMenu}
                  />

                  {/* Theme Sub-menu */}
                  {showThemeMenu && (
                    <div className={`absolute left-full top-0 ml-2 bg-[#1e1f20] border border-[#444746] rounded-2xl p-2 w-[180px] shadow-2xl animate-fadeIn ${window.innerWidth < 640 && 'left-0 bottom-full top-auto mb-2'}`}>
                      <ThemeOption
                        label="System"
                        selected={theme === 'System'}
                        onClick={() => dispatch(setTheme('System'))}
                      />
                      <ThemeOption
                        label="Light"
                        selected={theme === 'Light'}
                        onClick={() => dispatch(setTheme('Light'))}
                      />
                      <ThemeOption
                        label="Dark"
                        selected={theme === 'Dark'}
                        onClick={() => dispatch(setTheme('Dark'))}
                      />
                    </div>
                  )}
                </div>

                <DropdownItem icon={<CreditCard className="w-5 h-5" />} label="View subscriptions" />
                <DropdownItem icon={<BookOpen className="w-5 h-5" />} label="NotebookLM" />

                <hr className="border-[#444746] my-2" />

                <DropdownItem icon={<MessageSquarePlus className="w-5 h-5" />} label="Send feedback" />

                <div
                  onMouseEnter={() => {
                    setShowHelpMenu(true);
                    setShowThemeMenu(false);
                  }}
                  onMouseLeave={() => setShowHelpMenu(false)}
                  className="relative"
                >
                  <DropdownItem
                    icon={<HelpCircle className="w-5 h-5" />}
                    label="Help"
                    hasChevron
                    isActive={showHelpMenu}
                  />

                  {/* Help Sub-menu */}
                  {showHelpMenu && (
                    <div className={`absolute left-full top-0 ml-2 bg-[#1e1f20] border border-[#444746] rounded-2xl p-2 w-[200px] shadow-2xl animate-fadeIn ${window.innerWidth < 640 && 'left-0 bottom-full top-auto mb-2'}`}>
                      <div className="flex flex-col">
                        <DropdownItem
                          icon={<HelpCircle className="w-5 h-5" />}
                          label="Help Center"
                        />
                        <DropdownItem
                          icon={<Shield className="w-5 h-5" />}
                          label="Privacy"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 mt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#9ca3af] mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[13px] text-[#8ab4f8] font-medium leading-tight">Nana Varachha, Surat, Gujarat, India</p>
                      <p className="text-[11px] text-[#c4c7c5] mt-0.5 whitespace-nowrap">From your IP address • Update location</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            onClick={() => {
              setShowSettings(!showSettings);
              setShowThemeMenu(false);
              setShowHelpMenu(false);
            }}
            className={`flex items-center gap-3 p-2.5 rounded-full transition-colors group cursor-pointer ${showSettings ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <Settings className={`w-5 h-5 transition-colors ${showSettings ? 'text-[#e3e3e3]' : 'text-[#c4c7c5] group-hover:text-[#e3e3e3]'}`} />
            {extended && <p className={`text-sm transition-colors ${showSettings ? 'text-[#8ab4f8]' : 'text-[#8ab4f8] group-hover:text-blue-300'}`}>Settings</p>}
          </div>
        </div>
      </div>
    </>
  );
};

const DropdownItem = ({ icon, label, dot, hasChevron, isActive }) => (
  <div className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-white transition-colors group ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}>
    <div className="flex items-center gap-4">
      <span className={`transition-colors ${isActive ? 'text-white' : 'text-[#c4c7c5] group-hover:text-white'}`}>{icon}</span>
      <span className="text-sm font-light">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {dot && <div className="w-2 h-2 rounded-full bg-[#8ab4f8] shadow-[0_0_8px_rgba(138,180,248,0.6)]" />}
      {hasChevron && <ChevronRight className="w-4 h-4 text-[#c4c7c5]" />}
    </div>
  </div>
)


const ThemeOption = ({ label, selected, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer text-white transition-colors group"
  >
    <span className="text-sm font-light">{label}</span>
    {selected && <Check className="w-4 h-4 text-white" />}
  </div>
)

export default Sidebar;