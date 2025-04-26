import React from 'react';

export const DisasterImageDisplay = ({ imageUrl, disasterType }) => {
  return imageUrl ? (
    <div className="relative overflow-hidden rounded-lg shadow-md mb-4 bg-gray-100">
      <img
        src={imageUrl}
        alt={disasterType || "Disaster photo"}
        className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <span className="text-white text-sm font-medium">{disasterType || "Disaster report"}</span>
      </div>
    </div>
  ) : (
    <div
      className="w-full h-48 rounded-lg mb-4 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center bg-gray-50 text-gray-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="font-medium">No photo added</p>
    </div>
  );
};