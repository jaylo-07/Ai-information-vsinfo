import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Sidebar from './Pages/Sidebar';
import Header from './Pages/Header';
import Home from './Pages/Home';
import { Toaster } from 'react-hot-toast';

import whiteLogo from './asset/WHITE.svg';
import blackLogo from './asset/BLACK.svg';

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

    const updateFavicon = (e) => {
      const favicon = document.querySelector("link[rel~='icon']");
      if (favicon) {
        favicon.href = e.matches
          ? `${process.env.PUBLIC_URL || ''}/favicon-dark.svg`
          : `${process.env.PUBLIC_URL || ''}/favicon-light.svg`;
      }
    };

    updateFavicon(mediaQuery);

    const handleChange = (e) => {
      updateFavicon(e);
      if (theme === 'System') {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Root wrapper — single source of background + gradient blobs */}
      <div className="h-[100dvh] overflow-hidden flex bg-white dark:bg-[#09090b] text-black dark:text-white transition-colors duration-300 relative">
        {/* Global Background Gradient Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-[#9D00FF]/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse delay-700"></div>
        </div>
        {/* Content layer above blobs */}
        <div className="relative z-10 flex w-full h-full overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <Home />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
