"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuth } from "@/app/auth-provider";
import { useTranslation } from "react-i18next";
import ClientOnly from "./ClientOnly";
import { useState } from "react";
import { FaInstagram, FaGithub } from "react-icons/fa";

const Header = () => {
  const { user, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const blogHref = `/${locale}/blog`;

  const handleLogout = () => {
    signOut({ callbackUrl: `/` });
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-md text-gray-200 shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <ClientOnly>
          <Link href={`/`} className="text-2xl font-bold text-white">
            Tech-Note
          </Link>
        </ClientOnly>
        <ClientOnly>
          <div className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}/about`} className="text-gray-200 py-1 px-4 rounded-full text-sm font-semibold hover:text-white transition-colors">{t('about')}</Link>
            <Link href={blogHref} className="text-gray-200 py-1 px-4 rounded-full text-sm font-semibold hover:text-white transition-colors">{t('blog')}</Link>
            <Link href={`/${locale}/mypage`} className="text-gray-200 py-1 px-4 rounded-full text-sm font-semibold hover:text-white transition-colors">{t('mypage.title')}</Link>
            {/* Add more links as needed */}
          </div>
        </ClientOnly>
        <ClientOnly>
          <div>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </ClientOnly>
      </nav>
    </header>
  );
};

export default Header;