'use client';

import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

export default function CommunityPage() {
  const { t } = useTranslation();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{t('community')}</h1>
      <p>{t('community_features')}</p>
      <p>{t('community_description')}</p>
    </main>
  );
}
