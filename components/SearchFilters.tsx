'use client';
import React, { useState } from 'react';
import styles from './SearchFilters.module.css';

export default function SearchFilters({ titleQuery, dateFrom, dateTo, numMin, numMax, sort }:
  { titleQuery?: string; dateFrom?: string; dateTo?: string; numMin?: string; numMax?: string; sort?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${styles.btnBase} ${styles.filterButton}`}
        aria-expanded={open}
        aria-controls="detailed-search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.filterIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-1.447.894L9 17l-4.553 2.894A1 1 0 013 19V4z" />
        </svg>
        <span className={styles.filterButtonText}>상세검색</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`${styles.chevronIcon} ${open ? styles.rotated : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <form id="detailed-search" method="get" className={styles.form}>
          <input name="q" defaultValue={titleQuery} placeholder="제목 검색..." className={`${styles.input} ${styles.titleInput}`} />
          <input name="from" type="date" defaultValue={dateFrom} className={styles.input} />
          <input name="to" type="date" defaultValue={dateTo} className={styles.input} />
          <input name="min" type="number" defaultValue={numMin} placeholder="최소 번호" className={styles.input} />
          <input name="max" type="number" defaultValue={numMax} placeholder="최대 번호" className={styles.input} />
          <div className={styles.actions}>
            <select name="sort" defaultValue={sort} className={styles.select}>
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
            <button type="submit" className={`${styles.btnBase} ${styles.applyButton}`}>적용</button>
            <a href="/blog" className={`${styles.btnBase} ${styles.resetButton}`}>초기화</a>
          </div>
        </form>
      )}
    </div>
  );
}

