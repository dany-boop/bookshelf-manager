'use client';
import React from 'react';

const OfflineContainer = () => {
  const reloadPage = () => {
    location.reload();
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">You're Offline</h1>
      <p className="mt-2 text-gray-500">
        Please check your internet connection and try again.
      </p>
      <button
        onClick={reloadPage}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Reload
      </button>
    </div>
  );
};

export default OfflineContainer;
