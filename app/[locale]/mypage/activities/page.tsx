'use client';

import { useTranslation } from 'react-i18next';

export default function MyActivitiesPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{t('mypage.activities', '좋아요 및 댓글')}</h1>
      <p>{t('mypage.activities_placeholder', '좋아요를 누르거나 댓글을 작성한 글 목록이 여기에 표시됩니다.')}</p>
    </div>
  );
}
