import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Sidebar from './Pages/Sidebar';
import Header from './Pages/Header';
import Home from './Pages/Home';
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
