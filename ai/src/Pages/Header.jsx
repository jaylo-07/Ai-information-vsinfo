import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileSidebarOpen } from '../redux/slice/chat.slice';
import { googleLogin, googleLoginUser, logout, logoutUser } from '../redux/slice/auth.slice';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
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

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     const actionResult = await dispatch(googleLoginUser(credentialResponse.credential));

  //     if (!googleLoginUser.fulfilled.match(actionResult)) {
  //       toast.error('Login Failed');
  //     } else {
  //       toast.success('Successfully logged in!');
  //     }
  //   } catch (error) {
  //     toast.error('Login Failed');
  //   }
  // };

  // const handleGoogleError = () => {
  //   toast.error('Google Login Failed');
  // };

  const googleLogIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const userInfo = await res.json();

      const { name, email, sub, picture } = userInfo;
      const formattedUserName = name.replace(/\s+/g, '_');

      dispatch(googleLogin({ uid: sub, username: formattedUserName, fullName: name, email, photo: picture }))
    },
  });


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
                  <div className="absolute right-0 top-14 mt-2 w-[320px] bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-gray-200/50 dark:border-white/10 z-50 p-4 animate-fadeIn rounded-3xl overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-[#9D00FF]/20 via-purple-500/20 to-fuchsia-500/20 dark:from-[#9D00FF]/30 dark:to-fuchsia-500/30 blur-2xl z-0 rounded-t-3xl"></div>

                    <div className="relative z-10 flex flex-col items-center pt-3 mb-5">
                      {user.picture ? (
                        <div className="relative mb-4 group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#9D00FF] to-fuchsia-500 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                          <img src={user.picture} alt="Profile" className="relative w-20 h-20 rounded-full object-cover border-[3px] border-white/80 dark:border-[#121212]/80 shadow-xl transform group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="relative mb-4 group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#9D00FF] to-fuchsia-500 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#9D00FF] to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-[3px] border-white/80 dark:border-[#121212]/80 transform group-hover:scale-105 transition-all duration-500">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                      )}

                      <div className="text-center bg-white/50 dark:bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/60 dark:border-white/5 w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
                          {user.name || 'User'}
                        </p>
                        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-1 truncate w-full">
                          {user.email || 'Google Account'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        setIsDropdownOpen(false);
                      }}
                      className="relative z-10 w-full flex items-center justify-center gap-3 py-3.5 text-[15px] font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md group overflow-hidden border border-gray-200/50 dark:border-white/5"
                    >
                      <LogOut className="w-5 h-5 group-hover:-translate-x-1 group-hover:text-gray-900 dark:group-hover:text-white transition-transform duration-300 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="origin-right">
                {/* <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  text="signin"
                  prompt="select_account"
                /> */}
                <button
                  onClick={() => { googleLogIn() }}
                  className="flex items-center justify-center gap-1 p-[1px] rounded-full bg-primary-dark/20 text-white border-2 border-gray-600/50 w-full hover:bg-gray-700/60 transition-all duration-300 hover:border-gray-500/50 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className='w-9 h-9 p-[6px] rounded-full'>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                  </div>
                  <span className="font-medium tracking-tight text-gray-900 dark:text-white text-sm mr-4">Sign in</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;