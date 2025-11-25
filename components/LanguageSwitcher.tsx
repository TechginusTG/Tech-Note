'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => changeLanguage('ko')} 
        disabled={i18n.language === 'ko'}
        className="btn btn-ghost btn-sm text-2xl">
        🇰🇷
      </button>
      <button 
        onClick={() => changeLanguage('en')} 
        disabled={i18n.language === 'en'}
        className="btn btn-ghost btn-sm text-2xl">
        🇬🇧
      </button>
    </div>
  );
}
