"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './CategoryPanel.module.css';

type Category = { key: string; name: string; count: number };

const CategoryPanel = ({ categories, currentFilters }: { categories: Category[]; currentFilters?: Record<string, any> }) => {
  const [open, setOpen] = useState(false);

  const buildQuery = (params: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
    });
    return qs.toString() ? `?${qs.toString()}` : '';
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${styles.btnBase} ${styles.categoryButton}`} aria-expanded={open} aria-controls="category-panel">
        카테고리
      </button>

      {/* Overlay */}
      <div className={`${styles.overlay} ${open ? '' : styles.closed}`} aria-hidden={!open}>
        <div className={`${styles.backdrop} ${open ? styles.open : styles.closed}`} onClick={() => setOpen(false)} />

        <aside id="category-panel" className={`${styles.panel} ${open ? styles.open : styles.closed}`}>
          <div className={styles.header}>
            <h3 className={styles.title}>카테고리</h3>
            <button onClick={() => setOpen(false)} className={styles.closeButton}>닫기</button>
          </div>

          <div className={styles.content}>
            <ul className={styles.list}>
              {categories.map((c) => (
                <li key={c.key}>
                  <Link href={buildQuery({ ...currentFilters, category: c.key })} className={styles.listItemLink}>
                    <span>{c.name}</span>
                    <span className={styles.count}>{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default CategoryPanel;
