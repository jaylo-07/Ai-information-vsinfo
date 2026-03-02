import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileSidebarOpen } from '../redux/slice/chat.slice';
import { googleLoginUser, logout } from '../redux/slice/auth.slice';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import logo from '../logo.svg';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const actionResult = await dispatch(googleLoginUser(credentialResponse.credential));

      if (!googleLoginUser.fulfilled.match(actionResult)) {
        toast.error('Login Failed');
      } else {
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      toast.error('Login Failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login Failed');
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:py-6 lg:px-8 text-xl text-gray-900 dark:text-white sticky top-0 bg-transparent z-20 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setIsMobileSidebarOpen(true))}
            className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          {/* <img src={logo} alt="vsinfotech AI" className="h-10 cursor-pointer self-center" /> */}
          <p className="font-bold tracking-tight text-gray-900 dark:text-white">
            vsinfotech AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
                  {user.picture ? (
                    <img src={user.picture} alt="Profile" className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-gray-300 dark:border-[#444746] shadow-lg hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border border-gray-300 dark:border-[#444746] shadow-lg hover:scale-105 transition-transform">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 mt-2 w-[280px] bg-white dark:bg-[#121212] shadow-xl border border-gray-200 dark:border-gray-800 z-50 p-2 animate-fadeIn rounded-3xl">
                    <div className="bg-black/5 dark:bg-white/5 rounded-[20px] p-5 flex flex-col items-center mb-2 shadow-sm border border-black/5 dark:border-white/5">
                      <p className="text-xs font-medium text-gray-500 dark:text-[#c4c7c5] mb-4 truncate w-full text-center">
                        {user.email || 'Google Account'}
                      </p>
                      {user.picture ? (
                        <img src={user.picture} alt="Profile" className="w-[72px] h-[72px] rounded-full mb-3 object-cover border border-gray-100 dark:border-white/5" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-[72px] h-[72px] rounded-full mb-3 bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <p className="text-xl capitalize text-gray-900 dark:text-[#e3e3e3]">
                        Hi, {user.name?.split(' ')[0] || 'User'}!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 text-sm font-semibold text-gray-700 dark:text-white/80 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-[16px] transition-colors border border-transparent dark:hover:border-white/10"
                    >
                      <LogOut className="w-[18px] h-[18px]" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="scale-90 lg:scale-100 origin-right">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  text="signin"
                  prompt="select_account"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;