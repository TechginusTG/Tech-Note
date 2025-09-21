'use client';

import React from 'react';
import styles from './BlogSettingsModal.module.css';

export default function BlogSettingsModal({
  open,
  onClose,
  view,
  setView,
  theme,
  setTheme,
}: {
  open: boolean;
  onClose: () => void;
  view: 'list' | 'tile';
  setView: (v: 'list' | 'tile') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}) {
  if (!open) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modalContent}>
        <h2 className={styles.title}>보기 설정</h2>

        <div className={styles.optionsContainer}>
          <label className={`${styles.optionLabel} ${view === 'list' ? styles.optionLabelSelected : ''}`}>
            <input
              type="radio"
              name="blog-view"
              checked={view === 'list'}
              onChange={() => setView('list')}
            />
            <span>목록형 보기</span>
          </label>

          <label className={`${styles.optionLabel} ${view === 'tile' ? styles.optionLabelSelected : ''}`}>
            <input
              type="radio"
              name="blog-view"
              checked={view === 'tile'}
              onChange={() => setView('tile')}
            />
            <span>타일형 보기</span>
          </label>
        </div>

        <div className={styles.themeSection}>
          <h3 className={styles.themeTitle}>테마</h3>
          <div className={styles.themeOptionsContainer}>
            <label className={`${styles.optionLabel} ${theme === 'light' ? styles.optionLabelSelected : ''}`}>
              <input type="radio" name="blog-theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
              <span>라이트 모드</span>
            </label>

            <label className={`${styles.optionLabel} ${theme === 'dark' ? styles.optionLabelSelected : ''}`}>
              <input type="radio" name="blog-theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
              <span>다크 모드</span>
            </label>
          </div>
        </div>

        <div className={styles.buttonsContainer}>
          <button onClick={onClose} className={styles.cancelButton}>취소</button>
          <button onClick={onClose} className={styles.saveButton}>저장</button>
        </div>
      </div>
    </div>
  );
}

