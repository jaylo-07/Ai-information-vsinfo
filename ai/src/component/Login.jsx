import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleLoginUser } from '../redux/slice/auth.slice';
import toast from 'react-hot-toast';

const Login = () => {
    const dispatch = useDispatch();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const actionResult = await dispatch(googleLoginUser(credentialResponse.credential));

            if (googleLoginUser.fulfilled.match(actionResult)) {
                toast.success('Login Successful!');
            } else {
                toast.error('Login Failed');
            }
        } catch (error) {
            toast.error('Login Failed');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google Login Failed');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="p-8 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-[#444746] rounded-2xl shadow-lg dark:shadow-2xl max-w-sm w-full transition-colors">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign In</h2>
                <p className="text-center text-gray-600 dark:text-[#c4c7c5] mb-6">Use your Google account to log in.</p>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;