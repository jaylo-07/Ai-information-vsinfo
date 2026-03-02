import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu, Plus, MessageSquare, HelpCircle, History, Settings,
  Link, Sun, CreditCard, BookOpen, MessageSquarePlus,
  ChevronRight, MapPin, Check, Sparkles, Box, X, Shield, MoreVertical,
  Share2, Pin, Edit2, Trash2, Search, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt, setRecentPromptSafe, newChat, setTheme, setIsMobileSidebarOpen, fetchThreads, fetchThreadMessages, deleteThread, renameThread } from '../redux/slice/chat.slice';

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(null); // Track which chat menu is open
  const [chatMenuPos, setChatMenuPos] = useState({ top: 0, left: 0 });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [selectedHelpItem, setSelectedHelpItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const helpItemsData = [
    {
      title: 'Read the vsinfotech AI Documentation',
      content: 'Comprehensive guides, tutorials, and API documentation for developers integrating with vsinfotech AI platforms. Find everything you need to build and scale your AI applications securely.\n\nWhether you are looking to integrate natural language processing, advanced data analytics, or image recognition models, our robust API infrastructure gives you the building blocks necessary to scale quickly.\n\nKey features of our API:\n• Low Latency inference routing\n• 99.9% Uptime SLA for enterprise tier\n• End-to-end payload encryption\n• Real-time webhook delivery\n• Native integration with LangChain and LlamaIndex\n• Version-controlled endpoints to ensure stability\n\nGetting Started:\n1. Navigate to the Developer Dashboard and sign up for a free tier account.\n2. Create a new Organization and set up your initial Workspace.\n3. Generate a scoped API key. Make sure to save it securely as it will only be shown once.\n4. Install our official SDK for Node.js, Python, or Go.\n5. Authenticate your client and make your first generation request!\n\nFor deeper architectural overviews, checking system limits, and managing rate-limit headers properly, please reference our advanced deployment guides located in the core documentation portal.\n\nTo get your API key, visit the developer console, navigate to your project settings, and click "Generate New API Key".'
    },
    {
      title: 'Request a Demo for your business',
      content: 'Discover how our AI platforms can accelerate your business growth. Get in touch with our sales team to schedule a live demonstration tailored to your company needs.\n\nDuring your personalized 45-minute demo, an AI implementation specialist will walk you through:\n• Custom integrations tailored to your current software stack.\n• Scalability models and cost estimation.\n• Best practices for onboarding your team and training them on new AI-assisted workflows.\n• Deep dive into data privacy, regulatory compliance, and security features.\n\nWhat to expect:\nWe take a no-pressure, consultative approach. Our engineers want to understand your exact bottlenecks – whether it\'s automating customer support, extracting structured data from thousands of PDFs, or building a bespoke internal knowledge base.\n\nWe\'ll also provide you with a sandbox environment post-demo, pre-loaded with your specific data schema, so your engineering team can evaluate the implementation hands-on before making any commitments.\n\nContact our sales team via the main Contact Form, or email us directly at sales@vsinfotech.ca.'
    },
    {
      title: 'Explore the Partner Program',
      content: 'Join our Partner Program to build, market, and sell with vsinfotech AI. Empower your clients with next-generation AI solutions and unlock exclusive benefits and resources.\n\nAs a certified partner, you stand to benefit from:\n• Revenue Rev-share agreements on referred enterprise clients.\n• Early access to beta API features and upcoming UI model capabilities.\n• Priority technical support with a dedicated integration engineering contact.\n• Extensive marketing material and co-branding opportunities.\n• Dedicated listing on the vsinfotech AI Certified Expert directory.\n• Annual credits for internal testing and CI/CD pipelines.\n\nPartner Tiers:\n• Silver: Perfect for independent consultants. Offers standard rev-share and entry-level support access.\n• Gold: Designed for boutique agencies. Includes co-hosted webinars, advanced API limits, and early-access feature flags.\n• Platinum: For massive enterprise resellers. Unlocks dedicated account managers, custom SLA drafting, and white-labeling solutions.\n\nWhether you are an independent agency building custom solutions or a massive enterprise reseller, our tiered partner programs are designed to help you increase margins while delivering unparalleled value to your user base.'
    },
    {
      title: 'Join our Discord Community Forum',
      content: 'Connect with fellow developers, share insights, get inspired, and participate in lively discussions. Our engineers frequently participate in community events on Discord.\n\nWhy join the community?\n• Instant troubleshooting and architectural advice from veteran developers.\n• Showcases and feedback channels for your newest AI integrations.\n• Weekly technical workshops hosted by the vsinfotech AI engineering team.\n• Exclusive open-source tooling developed directly by the community, for the community.\n• Monthly hackathons with cash prizes and cloud credits for the winners.\n• Networking opportunities with top AI researchers and prompt engineers.\n\nKey Channels:\n#announcements - Stay up to date with the latest model releases and API changes.\n#general-chat - Watercooler talk and theoretical AI discussions.\n#api-help - Get unstuck quickly. Often monitored by our core backend engineers.\n#showcase - Share what you\'ve built and get constructive feedback.\n\nEnsure you read the #rules channel before verifying your account to maintain a safe and productive environment for everyone. We have a zero-tolerance policy for spam and abusive behavior.'
    },
    {
      title: 'Check your account & billing settings',
      content: 'Manage your active subscriptions, view your current usage limits, update payment methods, and export your previous billing statements directly from your account dashboard.\n\nNeed to upgrade your tier?\nNavigate to Setting > Plan & Usage to instantly scale your token limit thresholds or augment your API seat count.\n\nUsage Monitoring:\nWe strongly recommend setting up soft and hard billing limits. You can configure SMS or email alerts when your token consumption reaches 50%, 80%, and 100% of your specified monthly budget. This prevents unexpected charges from viral application growth or infinite loops in your code.\n\nPayment Methods:\nWe accept all major credit cards including Visa, Mastercard, and American Express. For enterprise tiers, we also support ACH transfers, Wire Transfers, and PO-based invoicing.\n\nAll invoices are consolidated monthly and delivered directly to the primary account email inbox. For tax exemption forms or custom payment arrangements, please escalate a ticket directly to billing@vsinfotech.ca with your account ID.'
    }
  ];

  const settingsRef = useRef(null);
  const chatMenuRef = useRef(null);

  const dispatch = useDispatch();
  const { threads, recentPrompt, theme, isMobileSidebarOpen, currentThreadId } = useSelector((state) => state.chat);
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch threads when Sidebar mounts if user is generally logged in (or just try to fetch)
    if (authState?.token || localStorage.getItem('token') || localStorage.getItem('Token')) {
      dispatch(fetchThreads());
    }
  }, [dispatch, authState?.token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
        setShowThemeMenu(false);
        setShowHelpMenu(false);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target) && !event.target.closest('.chat-menu-btn')) {
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

  const loadPrompt = async (threadId) => {
    dispatch(fetchThreadMessages(threadId));
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

      {/* Help Center Modal */}
      {showHelpModal && (
        <div className="fixed inset-x-2 top-2 bottom-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-4 sm:left-auto z-[100] animate-scaleIn flex flex-col pointer-events-none">
          <div className="bg-[#f0f4f9] dark:bg-[#060606] rounded-[24px] sm:rounded-[28px] w-full sm:w-[360px] max-w-full h-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-2xl transition-colors relative border border-gray-200 dark:border-[rgba(241,243,244,0.12)] flex flex-col overflow-hidden pointer-events-auto my-auto max-h-[96vh] sm:max-h-[85vh]">
            <div className="flex justify-between items-center px-4 pt-4 pb-2 shrink-0 border-b border-transparent data-[scrolled=true]:border-gray-200 dark:data-[scrolled=true]:border-white/10 transition-colors">
              {selectedHelpItem ? (
                <button onClick={() => setSelectedHelpItem(null)} className="w-10 h-10 flex items-center justify-center hover:bg-black/5 dark:bg-[rgba(241,243,244,0.08)] rounded-full transition-colors shrink-0">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#9aa0a6]" />
                </button>
              ) : (
                <div className="w-10"></div>
              )}
              <h2 className="text-lg text-gray-900 dark:text-[#e3e3e3] font-medium">{selectedHelpItem ? 'Article' : 'Help'}</h2>
              <button onClick={() => {
                setShowHelpModal(false);
                setTimeout(() => setSelectedHelpItem(null), 300);
              }} className="w-10 h-10 flex items-center justify-center hover:bg-black/5 dark:bg-[rgba(241,243,244,0.08)] rounded-full transition-colors shrink-0">
                <X className="w-5 h-5 text-gray-600 dark:text-[#9aa0a6]" />
              </button>
            </div>

            {selectedHelpItem ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-4 animate-fadeIn">
                <h3 className="text-[22px] font-medium text-gray-900 dark:text-[#e3e3e3] mb-6 leading-tight">{selectedHelpItem.title}</h3>
                <p className="text-[15px] text-gray-700 dark:text-[#9aa0a6] leading-relaxed mb-6 whitespace-pre-line">{selectedHelpItem.content}</p>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setSelectedHelpItem(null)} className="flex-1 py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-full transition-colors text-sm font-medium">Close Article</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-6 animate-fadeIn">

                <p className="text-xs font-medium text-gray-900 dark:text-[#e3e3e3] mb-2 px-2 mt-2">
                  {searchQuery.trim() ? 'Search Results' : 'Popular help resources'}
                </p>

                <div className="relative mb-2">
                  <Search className="w-[18px] h-[18px] text-gray-500 dark:text-[#9aa0a6] absolute left-5 top-1/2 -translate-y-1/2" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search Help" className="w-full bg-white dark:bg-white/5 border border-transparent hover:bg-gray-100 dark:hover:border-white/10 rounded-2xl pl-[46px] pr-4 py-3 text-sm outline-none text-gray-900 dark:text-white transition-colors shadow-sm dark:shadow-none focus:bg-white dark:focus:bg-[#1e1f20] focus:ring-1 focus:ring-gray-200 dark:focus:ring-white/20" />
                </div>

                <div className="flex flex-col gap-0.5 mb-6">
                  {helpItemsData
                    .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, i) => (
                      <div key={i} onClick={() => setSelectedHelpItem(item)} className="flex items-center gap-4 p-2.5 hover:bg-black/5 dark:bg-[rgba(241,243,244,0.04)] rounded-2xl cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-[#a8c7fa]/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-[18px] h-[18px] text-gray-600 dark:text-[#a8c7fa]" />
                        </div>
                        <span className="text-[13px] leading-5 text-gray-800 dark:text-[#e3e3e3] group-hover:underline">{item.title}</span>
                      </div>
                    ))}
                  {helpItemsData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-[13px] text-gray-500 dark:text-[#9aa0a6] px-2 italic">No results found for "{searchQuery}"</p>
                  )}
                </div>

                {/* <p className="text-xs font-medium text-gray-900 dark:text-[#e3e3e3] mb-3 px-2 mt-2 border-t border-gray-200 dark:border-[rgba(241,243,244,0.12)] pt-4">Need more help?</p>
                <div className="flex flex-col px-2">
                  <div className="flex flex-col border border-gray-200 dark:border-[rgba(241,243,244,0.12)] rounded-[20px] overflow-hidden mb-2">
                    <div onClick={() => {
                      setTimeout(() => window.open('https://discord.com', '_blank'), 1000);
                    }} className="flex items-start gap-4 p-4 hover:bg-black/5 dark:bg-[rgba(241,243,244,0.04)] cursor-pointer transition-colors border-b border-gray-200 dark:border-[rgba(241,243,244,0.12)]">
                      <MessageSquare className="w-[20px] h-[20px] text-gray-600 dark:text-[#9aa0a6] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[14px] font-medium text-gray-900 dark:text-[#e3e3e3] mb-0.5">Ask the Help Community</p>
                        <p className="text-[13px] text-gray-500 dark:text-[#9aa0a6]">Get answers from community experts</p>
                      </div>
                    </div>
                    <div onClick={() => {
                      window.location.href = "mailto:info@vsinfotech.ca";
                    }} className="flex items-start gap-4 p-4 hover:bg-black/5 dark:bg-[rgba(241,243,244,0.04)] cursor-pointer transition-colors">
                      <HelpCircle className="w-[20px] h-[20px] text-gray-600 dark:text-[#9aa0a6] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[14px] font-medium text-gray-900 dark:text-[#e3e3e3] mb-0.5">Contact us</p>
                        <p className="text-[13px] text-gray-500 dark:text-[#9aa0a6]">Email info@vsinfotech.ca</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 hover:bg-black/5 dark:bg-[rgba(241,243,244,0.04)] rounded-[20px] cursor-pointer transition-colors">
                    <AlertCircle className="w-[20px] h-[20px] text-gray-600 dark:text-[#9aa0a6] shrink-0" />
                    <p className="text-[14px] font-medium text-gray-900 dark:text-[#e3e3e3]">Report a problem</p>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-x-2 top-2 bottom-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-4 sm:left-auto z-[100] animate-scaleIn flex flex-col pointer-events-none">
          <div className="bg-[#f0f4f9] dark:bg-[#060606] rounded-[24px] sm:rounded-[28px] w-full sm:w-[360px] max-w-full h-fit max-h-[96vh] sm:max-h-[85vh] shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-2xl transition-colors relative border border-gray-200 dark:border-[rgba(241,243,244,0.12)] flex flex-col overflow-hidden pointer-events-auto my-auto">
            <div className="flex justify-between items-center px-4 pt-4 pb-2 shrink-0">
              <div className="w-10"></div>
              <h2 className="text-lg text-gray-900 dark:text-[#e3e3e3] font-medium">Privacy & Terms</h2>
              <button onClick={() => setShowPrivacyModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-black/5 dark:bg-[rgba(241,243,244,0.08)] rounded-full transition-colors shrink-0">
                <X className="w-5 h-5 text-gray-600 dark:text-[#9aa0a6]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 mt-2">
              <div className="flex flex-col items-center mb-6">
                <Shield className="w-12 h-12 text-themedark mb-3" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-[#e3e3e3] text-center">Privacy & Security</h3>
                <p className="text-xs text-gray-500 dark:text-[#9aa0a6] mt-1 italic text-center text-[12px]">Last updated: February 27, 2026</p>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-[14px] font-bold text-gray-900 dark:text-[#e3e3e3] mb-2 uppercase tracking-tight">1. Privacy Policy</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-[#e3e3e3] mb-1">Data Collection & Use</h4>
                      <p className="text-[13px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed">
                        vsinfotech AI collects user interaction data, including chat history and prompt inputs, solely to improve response accuracy and personalize your experience. We do not sell your personal data to third parties.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-[#e3e3e3] mb-1">Encrypted Storage</h4>
                      <p className="text-[13px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed">
                        All communications between your device and our servers are encrypted using industry-standard TLS protocols. Your data is stored in secured, access-controlled environments.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-[#e3e3e3] mb-1">Cookies & Tracking</h4>
                      <p className="text-[13px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed">
                        We use essential cookies to maintain your session and remember your preferences (such as light/dark mode). Analytical cookies help us understand non-identifiable usage patterns.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="pt-4 border-t border-gray-200 dark:border-[rgba(241,243,244,0.12)]">
                  <h3 className="text-[14px] font-bold text-gray-900 dark:text-[#e3e3e3] mb-2 uppercase tracking-tight">2. Terms of Service</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-[#e3e3e3] mb-1">Usage Guidelines</h4>
                      <p className="text-[13px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed">
                        By using vsinfotech AI, you agree not to input malicious code, copyrighted material without authorization, or prompts designed to bypass safety filters. Any abuse may lead to account suspension.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-[#e3e3e3] mb-1">Liability Disclaimer</h4>
                      <p className="text-[13px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed">
                        While we strive for 100% accuracy, AI-generated content may occasionally contain hallucinations or outdated facts. vsinfotech AI is not liable for decisions made based on AI output.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-[#e3e3e3] mb-1">Intellectual Property</h4>
                      <p className="text-[13px] text-gray-600 dark:text-[#9aa0a6] leading-relaxed">
                        Users retain ownership of the original prompts they create, while vsinfotech AI retains ownership of the underlying models and interface architecture.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-normal">
                    <strong>Note:</strong> We update these terms periodically to reflect new features or legal requirements. Continued use of the service constitutes agreement to the updated terms.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowPrivacyModal(false)} className="w-full mt-8 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-900 dark:text-[#e3e3e3] py-3 rounded-full transition-colors text-[14px] font-semibold">
                Understand and Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        flex flex-col justify-between bg-transparent lg:border-r border-black/5 dark:border-white/5 p-4
        transition-all duration-300 font-sans overflow-visible
        ${isMobileSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}
        ${extended ? 'lg:w-[280px]' : 'lg:w-[72px]'}
      `}>

        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between lg:justify-start">
            <div onClick={() => setExtended(prev => !prev)} className="hidden lg:flex cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-full w-10 h-10 items-center justify-center transition-colors">
              <Menu className="w-5 h-5 text-gray-900 dark:text-white/80" />
            </div>
            <div onClick={() => dispatch(setIsMobileSidebarOpen(false))} className="lg:hidden cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-gray-900 dark:text-white/80" />
            </div>
          </div>

          <div onClick={() => dispatch(newChat())} className={`mt-[40px] rounded-full cursor-pointer transition-colors group bg-black/5 dark:bg-[#1e1e1e] text-gray-700 dark:text-[#a0a09e] hover:bg-black/10 dark:hover:bg-[#252525] dark:hover:text-white ${extended ? 'w-full flex items-center gap-3 p-2.5 pl-4' : 'flex items-center justify-center w-10 h-10 px-0'}`}>
            <Plus className="w-5 h-5 shrink-0 text-gray-900 dark:text-white/80" />
            {extended && <p className="font-medium whitespace-nowrap text-[14px] text-gray-900 dark:text-white/80">New chat</p>}
          </div>

          {extended && (
            <div className="flex flex-col mt-8 animate-fadeIn">
              <p className="mb-4 text-sm px-1 font-semibold text-gray-900 dark:text-white">Recent</p>
              <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto scrollbar-hidden">
                {(!threads || threads.length === 0) && (
                  <p className="px-4 text-[13px] text-gray-500 dark:text-[#8e918f] italic">No recent chats</p>
                )}
                {threads && threads.map((item, index) => {
                  const isActive = currentThreadId === item.id;
                  return (
                    <div key={item.id} className={`relative flex items-center justify-between gap-2 p-2 pl-4 mb-[2px] rounded-full cursor-pointer transition-colors group ${showChatMenu === index || isActive ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-black/5 dark:bg-[#1e1e1e] text-gray-700 dark:text-[#a0a09e] hover:bg-black/10 dark:hover:bg-[#252525] hover:text-gray-900 dark:hover:text-white'}`}>
                      <div onClick={() => loadPrompt(item.id)} className="flex-1 min-w-0 pr-2">
                        {editingId === item.id ? (
                          <input
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            onBlur={() => {
                              if (editingTitle.trim() && editingTitle !== item.title) {
                                dispatch(renameThread({ threadId: item.id, title: editingTitle.trim() }));
                              }
                              setEditingId(null);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                if (editingTitle.trim() && editingTitle !== item.title) {
                                  dispatch(renameThread({ threadId: item.id, title: editingTitle.trim() }));
                                }
                                setEditingId(null);
                              }
                            }}
                            autoFocus
                            onClick={e => e.stopPropagation()}
                            className="bg-transparent outline-none w-full text-[13px] font-medium"
                          />
                        ) : (
                          <p className={`text-[13px] font-medium truncate w-full transition-colors ${showChatMenu === index || isActive ? 'text-purple-700 dark:text-purple-300' : ''}`}>{item.title}</p>
                        )}
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showChatMenu === index) {
                            setShowChatMenu(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setChatMenuPos({ top: rect.bottom - 40, left: rect.right + 10 });
                            setShowChatMenu(index);
                          }
                        }}
                        className={`chat-menu-btn p-1.5 rounded-full transition-all relative shrink-0 flex items-center justify-center ${showChatMenu === index ? 'opacity-100 bg-gray-300 dark:bg-[#0f1d33] text-gray-800 dark:text-white' : 'opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-white/70'}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </div>

                      {/* Chat Context Menu */}
                      {showChatMenu === index && createPortal(
                        <div
                          ref={chatMenuRef}
                          style={{
                            top: chatMenuPos.top,
                            left: chatMenuPos.left
                          }}
                          className="fixed bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-800 rounded-xl py-1.5 w-[220px] shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[9999] animate-scaleIn"
                        >
                          <button onClick={(e) => { e.stopPropagation(); setShowChatMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#252525] text-gray-800 dark:text-[#e3e3e3] transition-colors text-left">
                            <Pin className="w-[18px] h-[18px]" />
                            <span className="text-sm font-medium">Pin</span>
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(item.id);
                            setEditingTitle(item.title);
                            setShowChatMenu(null);
                          }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#252525] text-gray-800 dark:text-[#e3e3e3] transition-colors text-left">
                            <Edit2 className="w-[18px] h-[18px]" />
                            <span className="text-sm font-medium">Rename</span>
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteThread(item.id));
                            setShowChatMenu(null);
                          }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-[#252525] text-red-600 dark:text-[#e3e3e3] transition-colors text-left">
                            <Trash2 className="w-[18px] h-[18px] dark:text-[#ff6b6b]" />
                            <span className="text-sm font-medium dark:text-[#e3e3e3]">Delete</span>
                          </button>
                        </div>,
                        document.body
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
              className={`absolute bottom-full mb-4 left-0 glass-card border border-white/5 rounded-3xl p-2 w-[280px] shadow-2xl z-50 animate-scaleIn`}
            >
              <div className="flex flex-col relative">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowThemeMenu(!showThemeMenu);
                    setShowHelpMenu(false);
                  }}
                  className="relative"
                >
                  <DropdownItem
                    icon={<Sun className="w-5 h-5" />}
                    label="Theme"
                    className='mb-1'
                    hasChevron
                    isActive={showThemeMenu}
                  />

                  {/* Theme Sub-menu */}
                  {showThemeMenu && (
                    <div className="absolute left-0 bottom-full mb-2 glass-card border border-white/5 rounded-3xl p-2 w-[180px] shadow-2xl animate-scaleIn sm:left-full sm:bottom-0 sm:top-auto sm:mb-0 sm:ml-3">
                      <ThemeOption
                        label="System"
                        selected={theme === 'System'}
                        className='mb-1'
                        onClick={() => {
                          dispatch(setTheme('System'));
                          setShowThemeMenu(!showThemeMenu);
                          setShowSettings(false);
                          setShowHelpMenu(false);
                        }}
                      />
                      <ThemeOption
                        label="Light"
                        selected={theme === 'Light'}
                        className='mb-1'
                        onClick={() => {
                          dispatch(setTheme('Light'));
                          setShowThemeMenu(!showThemeMenu);
                          setShowSettings(false);
                          setShowHelpMenu(false);
                        }}
                      />
                      <ThemeOption
                        label="Dark"
                        selected={theme === 'Dark'}
                        onClick={() => {
                          dispatch(setTheme('Dark'));
                          setShowThemeMenu(!showThemeMenu);
                          setShowSettings(false);
                          setShowHelpMenu(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* <hr className="border-[#444746] my-2" /> */}

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHelpMenu(!showHelpMenu);
                    setShowThemeMenu(false);
                  }}
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
                    <div className="absolute left-0 bottom-full mb-2 glass-card border border-white/5 rounded-3xl p-2 w-[200px] shadow-2xl animate-scaleIn sm:left-full sm:bottom-0 sm:top-auto sm:mb-0 sm:ml-3">
                      <div className="flex flex-col">
                        <DropdownItem
                          icon={<HelpCircle className="w-5 h-5" />}
                          label="Help Center"
                          className='mb-1'
                          onClick={() => {
                            setShowHelpModal(true);
                            setShowSettings(false);
                            setShowHelpMenu(false);
                          }}
                        />
                        <DropdownItem
                          icon={<Shield className="w-5 h-5" />}
                          label="Privacy"
                          onClick={() => {
                            setShowPrivacyModal(true);
                            setShowSettings(false);
                            setShowHelpMenu(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
              setShowThemeMenu(false);
              setShowHelpMenu(false);
            }}
            className={`flex items-center gap-3 p-2.5 rounded-full transition-colors group cursor-pointer ${showSettings ? 'bg-white/10' : 'hover:bg-white/10'}`}
          >
            <Settings className={`w-5 h-5 transition-colors text-gray-900 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white`} />
            {extended && <p className={`text-sm transition-colors font-medium text-gray-900 dark:text-white`}>Settings</p>}
          </div>
        </div>
      </div >
    </>
  );
};

const DropdownItem = ({ icon, label, dot, hasChevron, isActive, onClick, className }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer text-gray-900 dark:text-white transition-colors group ${className} ${isActive ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}>
    <div className="flex items-center gap-4">
      <span className={`transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{icon}</span>
      <span className="text-sm font-normal">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {dot && <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#9D00FF]' : 'bg-transparent'}`} />}
      {hasChevron && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-white/50 group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors" />}
    </div>
  </div>
)

const ThemeOption = ({ label, selected, onClick, className }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-colors group ${className} ${selected ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-white/80'}`}
  >
    <span className={`text-sm ${selected ? 'font-medium' : 'font-normal'}`}>{label}</span>
    {selected && <Check className="w-4 h-4 text-gray-900 dark:text-white" />}
  </div>
)

export default Sidebar;