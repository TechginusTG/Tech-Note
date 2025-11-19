'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaNewspaper, FaHeart } from 'react-icons/fa';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  const sidebarNavItems = [
    {
      href: `/${locale}/mypage/profile`,
      title: t('mypage.profile', '개인정보'),
      icon: <FaUserCircle className="mr-3" />,
    },
    {
      href: `/${locale}/mypage/posts`,
      title: t('mypage.posts', '글 관리'),
      icon: <FaNewspaper className="mr-3" />,
    },
    {
      href: `/${locale}/mypage/activities`,
      title: t('mypage.activities', '좋아요 및 댓글'),
      icon: <FaHeart className="mr-3" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
