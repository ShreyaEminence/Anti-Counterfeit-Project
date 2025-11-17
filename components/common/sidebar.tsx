"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "@/_lib/constants";
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white dark:bg-gray-900 w-64 h-screen shadow-md p-5 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-8 text-indigo-600">Verici</h2>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg font-medium transition 
                ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
