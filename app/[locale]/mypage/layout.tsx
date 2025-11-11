'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function MyPageLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const sidebarNavItems = [
    {
      href: `/${locale}/mypage/profile`,
      title: t('mypage.profile', '개인정보'),
    },
    {
      href: `/${locale}/mypage/posts`,
      title: t('mypage.posts', '글 관리'),
    },
    {
      href: `/${locale}/mypage/activities`,
      title: t('mypage.activities', '좋아요 및 댓글'),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <nav className="flex flex-col space-y-2">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
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
