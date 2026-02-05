"use client";

import { useState } from "react";
import { mediaService } from "../../../services/media.service";
import { useAuth } from "../../../context/AuthContext";
import { RiImageLine, RiDeleteBinLine } from "react-icons/ri";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function ImageUploader({ 
  value, 
  onChange, 
  onError, 
  className = "" 
}: ImageUploaderProps) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      onError?.("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError?.("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const response = await mediaService.uploadImage(file, token || undefined);
      onChange(response.data.url);
      onError?.(""); // Clear any previous errors
    } catch (error) {
      console.error("Error uploading image:", error);
      onError?.("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />
      
      <label
        htmlFor="image-upload"
        className={`
          flex items-center justify-center gap-2 px-4 py-3 
          border-2 border-dashed border-gray-300 rounded-lg 
          cursor-pointer hover:border-gray-400 hover:bg-gray-50
          transition-colors
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <RiImageLine size={20} />
        <span className="text-sm font-medium">
          {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
        </span>
      </label>

      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <RiDeleteBinLine size={14} />
          </button>
        </div>
      )}
    </div>
  );
}