"use client";

import Link from "next/link";
import { useAuth } from "@/app/auth-provider";
import { useTranslation } from "react-i18next";
import ClientOnly from "./ClientOnly";
import { useState } from "react";
import { FaInstagram, FaGithub } from "react-icons/fa";

const Header = () => {
  const { user, setUser, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const [isLearnMoreOpen, setLearnMoreOpen] = useState(false);
  const [isSnsExpanded, setSnsExpanded] = useState(false);
  const locale = i18n.language;

  const handleLogout = () => {
    // In a real app, you'd call your sign-out endpoint.
    // For this example, we'll just clear the user state.
    setUser(null);
    // Redirect to home or login page after logout
    window.location.href = `/`;
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
          <div className="hidden md:flex items-center space-x-4">
            <Link href={`/${locale}/about`} className="bg-white text-gray-900 py-1 px-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">{t('about')}</Link>
            <Link href={`/${locale}/blog`} className="bg-white text-gray-900 py-1 px-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">{t('blog')}</Link>
            <Link href={`/${locale}/community`} className="bg-white text-gray-900 py-1 px-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">{t('community')}</Link>
            <div
              className="relative"
              onMouseEnter={() => setLearnMoreOpen(true)}
              onMouseLeave={() => { setLearnMoreOpen(false); setSnsExpanded(false); }}
            >
              <button className="bg-white text-gray-900 py-1 px-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                {t('learn_more')}
              </button>
              {isLearnMoreOpen && (
                <div className={`absolute top-full bg-white rounded-md shadow-lg z-10 transition-all duration-300 ${isSnsExpanded ? 'w-64' : 'w-56'}`}>
                  <div className="py-1">
                    <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('service_list')}</Link>
                    <button onClick={() => setSnsExpanded(!isSnsExpanded)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('sns')}
                    </button>
                    {isSnsExpanded && (
                      <div className="flex justify-around p-2">
                        <Link href="https://www.instagram.com/team_techginus/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-500">
                          <FaInstagram size={24} />
                        </Link>
                        <Link href="https://github.com/TechginusTG" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                          <FaGithub size={24} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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