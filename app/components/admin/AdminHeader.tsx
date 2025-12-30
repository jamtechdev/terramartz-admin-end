"use client";

import { RiSearchLine } from "react-icons/ri";

export default function AdminHeader() {
  return (
   <div className="px-6 py-4 border-b border-black/10 ">
     <div className="w-full max-w-md">
      <div className="relative group">
        <RiSearchLine
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2
                     text-gray-400
                     group-focus-within:text-green-500
                     transition-colors duration-200"
        />

        <input
          type="text"
          placeholder="Search folders, files, records..."
          className="w-full rounded-xl
                     bg-white
                     pl-12 pr-4 py-3
                     text-gray-900
                     placeholder-gray-400
                     border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-green-500
                     focus:border-transparent
                     transition-all duration-200"
        />
      </div>
    </div>
   </div>
  );
}
