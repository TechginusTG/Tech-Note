"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogSettingsModal from './BlogSettingsModal';

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
  const btnBase = 'inline-flex items-center justify-center h-9 min-w-[64px] px-3 rounded whitespace-nowrap text-sm';

  const buildQuery = (params: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
    });
    return qs.toString() ? `?${qs.toString()}` : '';
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">총 {total}개 중 {Math.min(start + 1, total)} - {Math.min(start + posts.length, total)} 표시</div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className={`${btnBase} bg-white border hover:bg-gray-50`}
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
        <div className="divide-y border rounded-b-md overflow-hidden">
          {posts.length > 0 ? (
            posts.map((post: any, idx: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block hover:bg-gray-50">
                <article className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4 md:hover:shadow-sm md:hover:translate-y-0.5 transition-transform duration-150">
                  <div className="md:col-span-1 text-sm text-gray-500">{total - (start + idx)}</div>
                  <div className="md:col-span-6">
                    <h2 className="text-lg md:text-xl font-medium text-gray-800 hover:text-blue-600">{post.title}</h2>
                    <div className="mt-1 text-xs text-gray-500 md:hidden">{post.excerpt}</div>
                  </div>
                  <div className="hidden md:block md:col-span-3 text-sm text-gray-600">{post.excerpt}</div>
                  <div className="md:col-span-2 text-sm text-gray-500 text-right">{new Date(post.createdAt).toLocaleDateString()}</div>
                </article>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-center">조건에 맞는 게시물이 없습니다.</p>
          )}
        </div>
      ) : (
        // Tile view: show message when no posts
        posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {posts.map((post: any, idx: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <article className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {/* Placeholder image area - if post.thumb exists, show it */}
                    {post.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumb} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">이미지 없음</div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 truncate">{post.title}</h3>
                    <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="ml-2">조회 {post.views ?? 0}</span>
                    </div>
                  </div>

                  {/* optional badge count */}
                  {post.count > 0 && (
                    <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">{post.count}+</div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-4 py-6 text-center">조건에 맞는 게시물이 없습니다.</p>
        )
      )}

      {/* pagination navigation */}
      <div className="mt-6 flex flex-col items-center">
        <nav className="inline-flex items-center space-x-2">
          <Link href={buildQuery({ ...baseFilters, page: Math.max(1, page - 1) })} className={`${btnBase} rounded-md border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`} aria-disabled={page === 1}>이전</Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildQuery({ ...baseFilters, page: p })} className={`${btnBase} rounded-md border ${p === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}>
              {p}
            </Link>
          ))}

          <Link href={buildQuery({ ...baseFilters, page: Math.min(totalPages, page + 1) })} className={`${btnBase} rounded-md border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`} aria-disabled={page === totalPages}>다음</Link>
        </nav>
      </div>
    </section>
  );
}
