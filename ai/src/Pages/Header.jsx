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

      dispatch(googleLogin({ uid: sub, username: formattedUserName, fullName: name, email, image: picture }))
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
                  {user.image ? (
                    <img src={user.image} alt="Profile" className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-gray-300 dark:border-[#444746] shadow-lg hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 via-[#9D00FF] to-blue-600 flex items-center justify-center text-white font-bold border border-gray-300 dark:border-[#444746] shadow-lg hover:scale-105 transition-transform">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 mt-2 w-[340px] bg-white/60 dark:bg-[#060606]/80 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/50 dark:border-white/10 z-50 p-2 animate-scaleIn rounded-[32px] overflow-hidden origin-top-right group/dropdown transition-all">
                    {/* Animated Abstract Base */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[32px]">
                      <div className="absolute -top-10 -right-10 w-48 h-48 bg-fuchsia-500/20 dark:bg-fuchsia-500/10 blur-[50px] rounded-full group-hover/dropdown:scale-110 transition-transform duration-700 ease-in-out"></div>
                      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/20 dark:bg-blue-500/10 blur-[50px] rounded-full group-hover/dropdown:scale-110 transition-transform duration-700 ease-in-out"></div>
                    </div>

                    <div className="relative z-10 w-full bg-white/40 dark:bg-black/40 rounded-[28px] p-5 shadow-inner border border-white/60 dark:border-white/5 backdrop-blur-md flex flex-col items-center">
                      <div className="relative mb-5 flex justify-center w-full">
                        {/* Rotating ring */}
                        {/* <div className="absolute w-[88px] h-[88px] rounded-full border border-dashed border-gray-400/50 dark:border-white/20 animate-[spin_10s_linear_infinite] group-hover/dropdown:border-[#9D00FF]/50 transition-colors duration-500"></div>
                        <div className="absolute w-[80px] h-[80px] rounded-full border border-gray-300 dark:border-white/10 animate-[spin_4s_linear_infinite_reverse]"></div> */}

                        {user.image ? (
                          <img src={user.image} alt="Profile" className="relative z-10 w-[72px] h-[72px] md:w-[76px] md:h-[76px] rounded-full object-cover shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(157,0,255,0.3)] border-2 border-white dark:border-[#121212] group-hover/dropdown:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="relative z-10 w-[72px] h-[72px] md:w-[76px] md:h-[76px] rounded-full bg-gradient-to-tr from-fuchsia-500 via-[#9D00FF] to-blue-600 flex items-center justify-center text-white text-[32px] font-bold shadow-[0_0_30px_rgba(157,0,255,0.4)] border-2 border-white dark:border-[#121212] group-hover/dropdown:scale-105 transition-transform duration-500">
                            {user.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center w-full text-center">
                        <p className="text-[19px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-[#a0a0a0] tracking-tight">
                          {user.fullName || 'User'}
                        </p>
                        <div className="mt-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full inline-flex max-w-full">
                          <p className="text-[12px] font-medium text-gray-600 dark:text-gray-400 truncate">
                            {user.email || 'Google Account'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 mt-2">
                      <button
                        onClick={() => {
                          dispatch(logoutUser());
                          setIsDropdownOpen(false);
                        }}
                        className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-3 py-3.5 bg-white/50 dark:bg-black/30 hover:bg-white dark:hover:bg-[#1f1f1f] rounded-[24px] border border-white/60 dark:border-white/5 transition-all duration-300 shadow-sm"
                      >
                        {/* Button hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9D00FF]/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></div>

                        <LogOut className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover/btn:text-red-500 dark:group-hover/btn:text-red-400 group-hover/btn:-translate-x-1 transition-all duration-300 relative z-10" strokeWidth={2.5} />
                        <span className="text-[14px] font-semibold text-gray-700 dark:text-[#d4d4d4] group-hover/btn:text-gray-900 dark:group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-300 relative z-10">Sign out</span>
                      </button>
                    </div>
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