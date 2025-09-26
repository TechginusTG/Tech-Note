'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div></div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {t('login')}
        </Link>
      </div>
    </header>
  );
}
