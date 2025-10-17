'use client';

import { useTranslation } from 'react-i18next';

const MyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{t('mypage')}</h1>
      <p>This is your personal page. You can view and edit your profile, manage your posts, and more.</p>
    </div>
  );
};

export default MyPage;
