import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { constants } from '../context/API/constants';

const VerifyEmailPage = () => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsActive(true);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleResend = async () => {
    try {
      await axios.post(`${constants.BASE_URL}/email/verification-notification`);
      setSeconds(60);
      setIsActive(false);
    } catch (error) {
      console.error("Failed to resend verification email", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="mb-4">Please check your email to verify your account.</p>
        <button
          onClick={handleResend}
          disabled={!isActive}
          className={`mt-4 px-4 py-2 text-white ${isActive ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500'} rounded`}
        >
          {isActive ? 'Resend Email' : `Resend Email (${seconds})`}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
