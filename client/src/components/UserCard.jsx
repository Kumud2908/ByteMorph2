import React from 'react';

export default function UserInfoCard({username}) {
  console.log("at user card",username)
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 w-full max-w-md text-center border border-gray-200">
      <h2 className="text-xl font-bold text-teal-600 mb-2">👤 {username}</h2>
      <p className="text-gray-500 text-xs mt-2">Premium User | Member since 2024</p>
 </div>
);
}