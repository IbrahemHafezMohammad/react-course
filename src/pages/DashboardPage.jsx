import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // Redirect to home if no user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    // Optionally, render null or a loading spinner while redirecting
    return null;
  }

  return (
    <div className="flex min-h-screen bg-blue-100 p-6">
      <div className="w-1/3 p-8 bg-white rounded-lg shadow-lg" style={{ height: '90vh' }}>
        <h2 className="text-xl font-semibold mb-4 text-center">User Information</h2>
        <div className="space-y-6 text-sm leading-relaxed">
          <p><strong>Name:</strong> {userInfo.name || <span className="text-gray-500">No name provided</span>}</p>
          
          <p>
            <strong>Email:</strong> {userInfo.email || <span className="text-gray-500">No email provided</span>}
            {userInfo.email_verified_at ? (
              <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full ml-2">Verified</span>
            ) : (
              <>
                <a href="/verify-email" className="text-blue-500 hover:underline ml-2">Please verify email</a>
                <p className="text-xs text-red-500 mt-1">Please verify your email to use our system features</p>
              </>
            )}
          </p>

          <p><strong>Phone:</strong> {userInfo.phone || <span className="text-gray-500">No phone number provided</span>}</p>
          <p><strong>Birthday:</strong> {userInfo.birthday || <span className="text-gray-500">No birthday provided</span>}</p>
          <p><strong>Gender:</strong> {userInfo.gender_name || <span className="text-gray-500">No gender information provided</span>}</p>
          <p><strong>Headline:</strong> {userInfo.headline || <span className="text-gray-500">No headline provided</span>}</p>
          <p><strong>Description:</strong> {userInfo.desc || <span className="text-gray-500">No description provided</span>}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
