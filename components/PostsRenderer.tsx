"use client";
import React from 'react';
import Link from 'next/link';

type Post = any;

export default function PostsRenderer({
  posts,
  total,
  start,
  perPage,
  baseFilters,
  page,
  totalPages,
  locale,
}: {
  posts: Post[];
  total: number;
  start: number;
  perPage: number;
  baseFilters: Record<string, any>;
  page: number;
  totalPages: number;
  locale: string;
}) {
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
        <div className="text-sm text-gray-600">총 {total}개</div>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="block group"
            >
              <article className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
                  {post.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumb} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 18" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                    <span>{post.author?.name || 'Unknown'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                    <span>조회 {post.views ?? 0}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">게시물이 없습니다.</p>
        </div>
      )}

      {/* pagination navigation */}
      <div className="mt-8 flex justify-center">
        <nav className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
          <Link href={buildQuery({ ...baseFilters, page: Math.max(1, page - 1) })} className={`${btnBase} rounded-md border border-gray-300 dark:border-gray-600 ${page === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-disabled={page === 1}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildQuery({ ...baseFilters, page: p })} className={`${btnBase} rounded-md border border-gray-300 dark:border-gray-600 ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
              {p}
            </Link>
          ))}

          <Link href={buildQuery({ ...baseFilters, page: Math.min(totalPages, page + 1) })} className={`${btnBase} rounded-md border border-gray-300 dark:border-gray-600 ${page === totalPages ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-disabled={page === totalPages}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </nav>
      </div>
    </section>
  );
}
