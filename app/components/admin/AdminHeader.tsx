"use client";

import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";

export default function AdminHeader() {
  return (
    <div className="px-6 py-4 justify-between bg-white shadow-sm flex">
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
                     bg-gray-100
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
      <div className="flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full w-10 h-10 object-cover"
        />

        <div className="hidden sm:block">
          <p className="text-sm font-medium text-black">John Doe</p>
          <p className="text-xs text-gray-400">johndoe@email.com</p>
        </div>
      </div>
    </div>
  );
}
