import React, { createContext, useState, useCallback } from 'react';

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [recentPrompt, setRecentPrompt] = useState('');
  const [theme, setTheme] = useState('System');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const setRecentPromptSafe = useCallback((prompt) => {
    setRecentPrompt(prompt);
    if (prompt) {
      setPrevPrompts((prev) => [...prev, prompt]);
    }
  }, []);

  const onSent = useCallback(
    async (prompt) => {
      if (!prompt) return;
      setPrevPrompts((prev) => [...prev, prompt]);
      // Placeholder for sending prompt to backend / AI service
      return Promise.resolve();
    },
    []
  );

  const newChat = useCallback(() => {
    setRecentPrompt('');
  }, []);

  const value = {
    onSent,
    prevPrompts,
    setRecentPrompt: setRecentPromptSafe,
    newChat,
    theme,
    setTheme,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    recentPrompt,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

