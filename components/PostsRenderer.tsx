"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogSettingsModal from './BlogSettingsModal';
import styles from './PostsRenderer.module.css';

type Post = any;

export default function PostsRenderer({
  posts,
  total,
  start,
  perPage,
  baseFilters,
  page,
  totalPages,
}: {
  posts: Post[];
  total: number;
  start: number;
  perPage: number;
  baseFilters: Record<string, any>;
  page: number;
  totalPages: number;
}) {
  const [view, setView] = useState<'list' | 'tile'>('list');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // load persisted view mode
  useEffect(() => {
    try {
      const v = localStorage.getItem('blog:view');
      if (v === 'list' || v === 'tile') setView(v as 'list' | 'tile');
    } catch (e) {
      // ignore
    }
  }, []);

  // persist view mode
  useEffect(() => {
    try {
      localStorage.setItem('blog:view', view);
    } catch (e) {
      // ignore
    }
  }, [view]);

  // load/persist theme
  useEffect(() => {
    try {
      const t = localStorage.getItem('blog:theme');
      if (t === 'light' || t === 'dark') setTheme(t as 'light' | 'dark');
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('blog:theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.add('theme-inverted');
    } else {
      root.classList.remove('dark');
      root.classList.remove('theme-inverted');
    }
  }, [theme]);

  const buildQuery = (params: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
    });
    return qs.toString() ? `?${qs.toString()}` : '';
  };

  return (
    <section>
      <div className={styles.header}>
        <div className={styles.postCount}>총 {total}개 중 {Math.min(start + 1, total)} - {Math.min(start + posts.length, total)} 표시</div>

        <div className={styles.settingsContainer}>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`${styles.btnBase} ${styles.settingsButton}`}
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
          >
            설정
          </button>
        </div>
      </div>

      <BlogSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        view={view}
        setView={setView}
        theme={theme}
        setTheme={setTheme}
      />

      {view === 'list' ? (
        <div className={styles.listWrapper}>
          {posts.length > 0 ? (
            posts.map((post: any, idx: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={styles.listItemLink}>
                <article className={styles.listItemArticle}>
                  <div className={styles.listItemNumber}>{total - (start + idx)}</div>
                  <div className={styles.listItemMain}>
                    <h2 className={styles.listItemTitle}>{post.title}</h2>
                    <div className={styles.listItemExcerptMobile}>{post.excerpt}</div>
                  </div>
                  <div className={styles.listItemExcerptDesktop}>{post.excerpt}</div>
                  <div className={styles.listItemDate}>{new Date(post.createdAt).toLocaleDateString()}</div>
                </article>
              </Link>
            ))
          ) : (
            <p className={styles.noPostsMessage}>조건에 맞는 게시물이 없습니다.</p>
          )}
        </div>
      ) : (
        // Tile view: show message when no posts
        posts.length > 0 ? (
          <div className={styles.tileGrid}>
            {posts.map((post: any, idx: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={styles.tileItemLink}>
                <article className={styles.tileItemArticle}>
                  <div className={styles.tileImageContainer}>
                    {/* Placeholder image area - if post.thumb exists, show it */}
                    {post.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumb} alt={post.title} className={styles.tileImage} />
                    ) : (
                      <div className={styles.tileImagePlaceholder}>이미지 없음</div>
                    )}
                  </div>

                  <div className={styles.tileContent}>
                    <h3 className={styles.tileTitle}>{post.title}</h3>
                    <div className={styles.tileMeta}>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className={styles.tileViews}>조회 {post.views ?? 0}</span>
                    </div>
                  </div>

                  {/* optional badge count */}
                  {post.count > 0 && (
                    <div className={styles.tileBadge}>{post.count}+</div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.noPostsMessage}>조건에 맞는 게시물이 없습니다.</p>
        )
      )}

      {/* pagination navigation */}
      <div className={styles.paginationContainer}>
        <nav className={styles.paginationNav}>
          <Link href={buildQuery({ ...baseFilters, page: Math.max(1, page - 1) })} className={`${styles.btnBase} ${styles.paginationLink} ${page === 1 ? styles.paginationLinkDisabled : styles.paginationLinkEnabled}`} aria-disabled={page === 1}>이전</Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildQuery({ ...baseFilters, page: p })} className={`${styles.btnBase} ${styles.paginationLink} ${p === page ? styles.paginationLinkActive : styles.paginationLinkInactive}`}>
              {p}
            </Link>
          ))}

          <Link href={buildQuery({ ...baseFilters, page: Math.min(totalPages, page + 1) })} className={`${styles.btnBase} ${styles.paginationLink} ${page === totalPages ? styles.paginationLinkDisabled : styles.paginationLinkEnabled}`} aria-disabled={page === totalPages}>다음</Link>
        </nav>
      </div>
    </section>
  );
}

