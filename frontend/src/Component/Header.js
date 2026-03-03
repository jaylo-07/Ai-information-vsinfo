import React, { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosSearch, IoIosMenu, IoIosClose, IoIosMoon, IoIosSunny } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';

import whiteLogo from '../Asset/WHITE.svg'
import blackLogo from '../Asset/BLACK.svg'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const location = useLocation()
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    setPath(location.pathname)
  }, [location.pathname])
  return (
    <>
      <header className="sticky shadow-lg dark:shadow-black py-4 top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#060606] text-gray-700 dark:text-[#9aa0a6] transition-colors duration-300">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-1 text-lg font-medium gap-10">
            <Link to="/" className='flex items-center space-x-1 text-black dark:text-[#f1f3f4]'>
              {/* <span className="text-sm sm:text-base">Google</span>
            <span className="text-base sm:text-lg">DeepMind</span>
            <button className="text-xs sm:text-sm"><IoIosArrowDown /></button> */}
              <img src={blackLogo} alt="Logo" className="w-18 h-12 cursor-pointer self-center block dark:hidden" />
              <img src={whiteLogo} alt="Logo" className="w-18 h-12 cursor-pointer self-center hidden dark:block" />
            </Link>
            <nav className="hidden sm:flex space-x-4 text-sm">
              <Link to="/" className={`${path === '/' ? "text-black dark:text-white" : ""} hover:bg-gray-200 dark:hover:bg-[rgba(241,243,244,0.08)] hover:rounded-full py-2 px-4 font-medium transition`} onClick={() => setPath("/")}>Home</Link>
              <Link to="/about" className={`${path === '/about' ? "text-black dark:text-white" : ""} hover:bg-gray-200 dark:hover:bg-[rgba(241,243,244,0.08)] hover:rounded-full py-2 px-4 font-medium transition`} onClick={() => setPath("/about")}>About Us</Link>
              <Link to="/career" className={`${path === '/career' ? "text-black dark:text-white" : ""} hover:bg-gray-200 dark:hover:bg-[rgba(241,243,244,0.08)] hover:rounded-full py-2 px-4 font-medium transition`} onClick={() => setPath("/career")}>Career</Link>
              <Link to="/contact" className={`${path === '/contact' ? "text-black dark:text-white" : ""} hover:bg-gray-200 dark:hover:bg-[rgba(241,243,244,0.08)] hover:rounded-full py-2 px-4 font-medium transition`} onClick={() => setPath("/contact")}>Contact Us</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-3 ms-auto">
            {/* <a href="http://yoyoai.ca/"><button className="bg-[rgba(241,243,244,0.08)] font-medium px-3 lg:px-4 py-1.5 rounded-full text-xs sm:text-sm hover:bg-[rgba(241,243,244,0.12)] transition">Build with Ai</button></a> */}
            {/* <button className="bg-[rgba(241,243,244,0.08)] font-medium px-3 lg:px-4 py-1.5 rounded-full text-xs sm:text-sm hover:bg-[rgba(241,243,244,0.12)] transition">★ Try Gemini</button> */}
            {/* <button className="bg-[rgba(241,243,244,0.08)] p-2 rounded-full hover:bg-[rgba(241,243,244,0.12)] transition"><IoIosSearch /></button> */}
            <button onClick={toggleTheme} className="bg-gray-200 dark:bg-[rgba(241,243,244,0.08)] p-2 rounded-full hover:bg-gray-300 dark:hover:bg-[rgba(241,243,244,0.12)] transition text-xl flex items-center justify-center">
              {theme === 'dark' ? <IoIosSunny className="text-yellow-400" /> : <IoIosMoon className="text-gray-800" />}
            </button>
          </div>
          <div className="flex sm:hidden items-center space-x-2 ms-auto">
            <button onClick={toggleTheme} className="bg-gray-200 dark:bg-[rgba(241,243,244,0.08)] p-2 rounded-full hover:bg-gray-300 dark:hover:bg-[rgba(241,243,244,0.12)] transition text-xl flex items-center justify-center">
              {theme === 'dark' ? <IoIosSunny className="text-yellow-400" /> : <IoIosMoon className="text-gray-800" />}
            </button>
            <button onClick={toggleMobileMenu} className="bg-gray-200 dark:bg-[rgba(241,243,244,0.08)] p-2 rounded-full hover:bg-gray-300 dark:hover:bg-[rgba(241,243,244,0.12)] transition ms-3 flex items-center justify-center text-xl text-black dark:text-white">{isMobileMenuOpen ? <IoIosClose /> : <IoIosMenu />}</button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#060606] border-t border-gray-200 dark:border-gray-800 z-50">
            <nav className="flex flex-col p-4 space-y-2">
              <Link to="/" className={`${path === '/' ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"} hover:bg-gray-100 dark:hover:bg-[rgba(241,243,244,0.08)] rounded-lg py-3 px-4 font-medium transition text-sm`} onClick={() => setPath("/")}>Home</Link>
              <Link to="/about" className={`${path === '/about' ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"} hover:bg-gray-100 dark:hover:bg-[rgba(241,243,244,0.08)] rounded-lg py-3 px-4 font-medium transition text-sm`} onClick={() => setPath("/about")}>About Us</Link>
              <Link to="/career" className={`${path === '/career' ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"} hover:bg-gray-100 dark:hover:bg-[rgba(241,243,244,0.08)] rounded-lg py-3 px-4 font-medium transition text-sm`} onClick={() => setPath("/career")}>Career</Link>
              <Link to="/contact" className={`${path === '/contact' ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"} hover:bg-gray-100 dark:hover:bg-[rgba(241,243,244,0.08)] rounded-lg py-3 px-4 font-medium transition text-sm`} onClick={() => setPath("/contact")}>Contact Us</Link>
              <div className="border-t border-gray-800 mt-4 pt-4 space-y-2 md:hidden">
                {/* <a href="http://yoyoai.ca/"><button className="w-full bg-[rgba(241,243,244,0.08)] font-medium py-3 px-4 rounded-lg text-sm hover:bg-[rgba(241,243,244,0.12)] transition">Build with Ai</button></a> */}
                {/* <button className="w-full bg-[rgba(241,243,244,0.08)] font-medium py-3 px-4 rounded-lg text-sm hover:bg-[rgba(241,243,244,0.12)] transition">★ Try Gemini</button> */}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

export default Header;
