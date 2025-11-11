'use client';

import { useTranslation } from 'react-i18next';

export default function MyPostsPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{t('mypage.posts', '글 관리')}</h1>
      <p>{t('mypage.posts_placeholder', '내가 작성한 글 목록이 여기에 표시됩니다.')}</p>
    </div>
  );
}
