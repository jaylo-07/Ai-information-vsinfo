import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileSidebarOpen } from '../redux/slice/chat.slice';
import { googleLoginUser, logout } from '../redux/slice/auth.slice';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
      <div className="flex items-center justify-between p-4 lg:p-6 text-xl text-gray-800 dark:text-[#c4c7c5] sticky top-0 bg-white/80 dark:bg-[#131314]/80 backdrop-blur-md z-20 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setIsMobileSidebarOpen(true))}
            className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-[#c4c7c5]" />
          </button>
          <p className="font-bold tracking-tight text-gray-900 dark:text-white">
            Vsinfo AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-[12px] font-medium text-gray-700 dark:text-[#c4c7c5] animate-fadeIn transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-themedark animate-pulse"></span>
            Vsinfo v4.0
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img src={user.picture} alt="Profile" className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-gray-300 dark:border-[#444746] shadow-lg hover:scale-105 transition-transform cursor-pointer" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border border-gray-300 dark:border-[#444746] shadow-lg hover:scale-105 transition-transform cursor-pointer">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <button onClick={() => dispatch(logout())} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full transition-colors flex items-center justify-center" title="Logout">
                  <LogOut className="w-4 h-4 text-gray-600 dark:text-[#c4c7c5]" />
                </button>
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