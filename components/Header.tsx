"use client";

import Link from "next/link";
import { useAuth } from "@/app/auth-provider";
import axios from "axios";

const Header = () => {
  const { user, setUser, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      // Optionally, redirect to homepage
      window.location.href = "/";
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Tech-Note</Link>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : user ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

