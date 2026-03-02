import React from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleLoginUser } from '../redux/slice/auth.slice';
import toast from 'react-hot-toast';

const Login = () => {
    const dispatch = useDispatch();

    // const handleGoogleSuccess = async (credentialResponse) => {
    //     try {
    //         const actionResult = await dispatch(googleLoginUser(credentialResponse.credential));

    //         if (googleLoginUser.fulfilled.match(actionResult)) {
    //             toast.success('Login Successful!');
    //         } else {
    //             toast.error('Login Failed');
    //         }
    //     } catch (error) {
    //         toast.error('Login Failed');
    //     }
    // };

    // const handleGoogleError = () => {
    //     toast.error('Google Login Failed');
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
            console.log("userInfo", userInfo);

            dispatch(googleLogin({ uid: sub, userName: formattedUserName, fullName: name, email, photo: picture })).then((response) => {
                if (response.payload.success) {
                    navigate('/');
                }

                if (response?.payload?.user && response?.payload?.user?.role === "admin") {
                    sessionStorage.setItem('hasRedirected', 'true');
                    navigate("/admin");
                }
            });
        },
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="p-8 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-[#444746] rounded-2xl shadow-lg dark:shadow-2xl max-w-sm w-full transition-colors">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign In</h2>
                <p className="text-center text-gray-600 dark:text-[#c4c7c5] mb-6">Use your Google account to log in.</p>

                <div className="flex justify-center">
                    <button
                        onClick={() => { googleLogIn() }}
                        whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(55, 65, 81, 0.8)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 bg-primary-dark/20 text-white border border-gray-600/50 w-full py-3 rounded-lg hover:bg-gray-700/60 transition-all duration-300 hover:border-gray-500/50 backdrop-blur-sm"
                    >
                        {/* <img
                            src={google_login}
                            alt="google_login"
                            className="w-5 h-5"
                        /> */}
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                        <span className="font-medium">Continue with Google</span>
                    </button>
                    {/* <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default Login;