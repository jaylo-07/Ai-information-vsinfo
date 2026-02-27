import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleLoginUser } from '../redux/slice/auth.slice';

const Login = () => {
    const dispatch = useDispatch();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const actionResult = await dispatch(googleLoginUser(credentialResponse.credential));

            if (googleLoginUser.fulfilled.match(actionResult)) {
                console.log('Login Success:', actionResult.payload);
                alert('Login Successful!');
            } else {
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
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-md max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
                <p className="text-center text-gray-600 mb-6">Use your Google account to log in.</p>

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