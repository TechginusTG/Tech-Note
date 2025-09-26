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
        className={`px-3 py-1 rounded ${i18n.language === 'ko' ? 'bg-gray-300' : 'bg-gray-100'}`}>
        한국어
      </button>
      <button 
        onClick={() => changeLanguage('en')} 
        disabled={i18n.language === 'en'}
        className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-gray-300' : 'bg-gray-100'}`}>
        English
      </button>
    </div>
  );
}
