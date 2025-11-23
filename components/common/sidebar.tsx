"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { links } from "@/_lib/constants";
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear cookie (same name as your token cookie)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

    // Redirect to login
    router.push("/login");
  };
  return (
    <aside className="bg-white dark:bg-gray-900 w-64 h-screen shadow-md p-5 fixed left-0 top-0 flex flex-col justify-between">
      <div>
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
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-10 w-full px-4 py-2 text-left rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200"
      >
        Logout
      </button>
    </aside>
  );
}
