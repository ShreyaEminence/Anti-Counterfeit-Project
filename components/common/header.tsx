"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [name, setName] = useState<string>("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName");
      if (storedName) setName(storedName);
    }
  }, []);

  const avatarInitial = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="w-full h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6">
      <div></div> {/* Keeps layout balanced */}
      {/* Right Side Profile */}
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-gray-600 dark:text-gray-300 font-medium">
          {name}
        </span>
        <img
          src={`https://ui-avatars.com/api/?name=${avatarInitial}`}
          className="w-10 h-10 rounded-full"
          alt="User Avatar"
        />
      </div>
    </header>
  );
}
