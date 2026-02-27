import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileSidebarOpen } from '../redux/slice/chat.slice';
import { googleLoginUser, logout } from '../redux/slice/auth.slice';
import { GoogleLogin } from '@react-oauth/google';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const actionResult = await dispatch(googleLoginUser(credentialResponse.credential));

      if (!googleLoginUser.fulfilled.match(actionResult)) {
        console.error('Login Error:', actionResult.payload);
        alert('Login Failed');
      }
    } catch (error) {
      console.error('Error during login dispatch:', error);
      alert('Login Failed');
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    alert('Google Login Failed');
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:p-6 text-xl text-text-secondary sticky top-0 bg-bg-primary/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setIsMobileSidebarOpen(true))}
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
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img src={user.picture} alt="Profile" className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-border-main shadow-lg hover:scale-105 transition-transform cursor-pointer" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border border-border-main shadow-lg hover:scale-105 transition-transform cursor-pointer">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <button onClick={() => dispatch(logout())} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors flex items-center justify-center" title="Logout">
                  <LogOut className="w-4 h-4 text-[#c4c7c5]" />
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
                  useOneTap
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