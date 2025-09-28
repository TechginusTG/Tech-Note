'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div></div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        {session ? (
          <div className="flex items-center space-x-4">
            <span>{session.user.name}</span>
            <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              {t('logout')}
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
}
