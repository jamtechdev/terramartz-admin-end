"use client";

import Image from "next/image";
import { RiSearchLine, RiMenuLine } from "react-icons/ri";

export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <div className="px-6 py-4 bg-white shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          <RiMenuLine className="text-black" size={22} />
        </button>

        {/* Search */}
        <div className="relative w-full max-w-xl">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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

      {/* User */}
      {/* <div className="flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full w-10 h-10 object-cover"
        />
        <div className="hidden sm:block">
          <p className="text-sm text-black font-medium">John Doe</p>
          <p className="text-xs text-gray-400">johndoe@email.com</p>
        </div>
      </div> */}
    </div>
  );
}
