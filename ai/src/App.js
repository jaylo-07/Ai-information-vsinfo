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
      <div className="h-[100dvh] overflow-hidden flex bg-white dark:bg-[#09090b] text-black dark:text-white transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#09090b] transition-colors duration-300">
          <Header />
          <Home />
        </div>
      </div>
    </>
  );
}

export default App;
