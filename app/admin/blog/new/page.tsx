'use client';

import { useTranslation } from 'react-i18next';
import Editor from '@/components/editor/Editor';
import styles from './page.module.css';
import ClientOnly from '@/components/ClientOnly';

export default function NewPostPage() {
  const { t } = useTranslation();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{t('create_new_post')}</h1>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>{t('title')}</label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            placeholder={t('enter_post_title')}
          />
        </div>
        <div className={styles.formGroupLarge}>
          <label className={styles.label}>{t('content')}</label>
          <ClientOnly>
            <Editor />
          </ClientOnly>
        </div>
        <button
          type="submit"
          className={styles.button}
        >
          {t('publish_post')}
        </button>
      </form>
    </main>
  );
}
