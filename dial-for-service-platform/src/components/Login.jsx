
// Login.jsx
import React, { useState } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '@/lib/firebase';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const auth = getAuth(app);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => sendOTP(),
    });
  };

  const sendOTP = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, '+91' + phone, appVerifier);
    setConfirmation(confirmationResult);
  };

  const verifyOTP = async () => {
    if (confirmation) {
      await confirmation.confirm(otp);
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Login with OTP</h1>
      <input type="text" placeholder="Enter phone number" className="border p-2 mb-2 w-full" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div id="recaptcha-container"></div>
      <button onClick={sendOTP} className="bg-blue-500 text-white px-4 py-2 mb-4 w-full">Send OTP</button>
      <input type="text" placeholder="Enter OTP" className="border p-2 mb-2 w-full" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verifyOTP} className="bg-green-500 text-white px-4 py-2 w-full">Verify OTP</button>
    </div>
  );
};

export default Login;
