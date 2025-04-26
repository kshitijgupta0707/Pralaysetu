import React from 'react';
import { Camera, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

export const ImageUploader = ({ 
  imagePreview, 
  onUpload, 
  onClear, 
  label = "Upload Photo (Optional)",
  placeholder = "Click to upload an image",
  subtext = "Supported: JPG, PNG, GIF (max 5MB)"
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">{label}</Label>
      <div className="grid grid-cols-1 gap-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
          />
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center cursor-pointer min-h-[160px]"
          >
            {imagePreview ? (
              <div className="relative w-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[500px] object-contain rounded"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClear();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {placeholder}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {subtext}
                </span>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
