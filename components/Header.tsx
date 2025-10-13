"use client";

import Link from "next/link";
import { useAuth } from "@/app/auth-provider";

const Header = () => {
  const { user, setUser, isLoading } = useAuth();

  const handleLogout = () => {
    // In a real app, you'd call your sign-out endpoint.
    // For this example, we'll just clear the user state.
    setUser(null);
    // Redirect to home or login page after logout
    window.location.href = "/";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md text-gray-800 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Tech-Note
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/blog" className="hover:text-gray-500">Blog</Link>
          <Link href="/community" className="hover:text-gray-500">Community</Link>
          {/* Add more links as needed */}
        </div>
        <div>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

