"use client";
import "./globals.css";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login";

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        {!isAuthPage && (
          <>
            <Sidebar />
            <div className="ml-64">
              <Header />
            </div>
          </>
        )}

        <main className={!isAuthPage ? "ml-64 mt-16 p-6" : ""}>{children}</main>
      </body>
    </html>
  );
}
