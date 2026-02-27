import React, { useContext } from 'react';
import { Menu } from 'lucide-react';
import { Context } from '../context/Context';

const Header = () => {
  const { setIsMobileSidebarOpen } = useContext(Context);

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:p-6 text-xl text-text-secondary sticky top-0 bg-bg-primary/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-hover-overlay rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-text-secondary" />
          </button>
          <p className="text-text-primary font-medium tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text">
            Nexus AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[12px] font-medium text-text-secondary animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Nexus v4.0
          </div>
          <div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-border-main shadow-lg hover:scale-105 transition-transform cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;