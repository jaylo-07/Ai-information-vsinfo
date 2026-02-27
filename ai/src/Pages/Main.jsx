import React, { useState } from 'react';
import { Send, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPrompt, setRecentPromptSafe } from '../redux/slice/chat.slice';

const Main = () => {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const { currentResponse, isLoading, recentPrompt, user } = useSelector((state) => ({
        ...state.chat,
        ...state.auth
    }));

    const handleSend = () => {
        if (input.trim()) {
            dispatch(setRecentPromptSafe(input));
            dispatch(sendPrompt(input));
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <main className="flex-1 flex flex-col justify-between p-4 lg:p-8 relative min-h-0">
            <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto flex flex-col gap-6 pb-20 scrollbar-hide">
                {!currentResponse && !isLoading && !recentPrompt ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Hello, {user ? user.name.split(' ')[0] : "I'm Nexus AI"}
                        </h1>
                        <p className="text-base md:text-lg text-[#c4c7c5] max-w-xl">
                            Ask anything and I'll help you with answers, ideas, and code.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 mt-4">
                        {recentPrompt && (
                            <div className="flex gap-4 self-end max-w-[85%]">
                                <div className="bg-white/10 rounded-2xl rounded-tr-none px-5 py-3 text-white">
                                    <p className="text-sm md:text-base leading-relaxed">{recentPrompt}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                    {user?.picture ? (
                                        <img src={user.picture} alt="User" className="w-full h-full rounded-full" />
                                    ) : (
                                        <User className="w-5 h-5 text-white" />
                                    )}
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex gap-4 self-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin shrink-0"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 w-48 bg-white/10 rounded animate-pulse"></div>
                                    <div className="h-4 w-64 bg-white/10 rounded animate-pulse"></div>
                                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ) : currentResponse && (
                            <div className="flex gap-4 self-start max-w-[90%]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">NA</span>
                                </div>
                                <div className="text-[#e3e3e3] px-2">
                                    {/* Using dangerouslySetInnerHTML to parse basic markdown if needed or just display text seamlessly */}
                                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{currentResponse.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 left-0 right-0 max-w-4xl mx-auto px-4 w-full">
                <div className="bg-[#1e1f20] border border-[#444746] flex items-center rounded-full p-2 pr-4 shadow-xl">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Nexus anything..."
                        className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-[#8e918f] text-sm md:text-base h-10"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`p-2 rounded-full transition-colors ${input.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/5 text-[#8e918f] cursor-not-allowed'}`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-center text-[#8e918f] text-xs mt-3">
                    Nexus may display inaccurate info, including about people, so double-check its responses.
                </p>
            </div>
        </main>
    );
};

export default Main;
