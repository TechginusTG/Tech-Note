import { fetchPosts } from '@/lib/api';
import Link from 'next/link';

function excerpt(text: string | undefined, len = 120) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len).trimEnd() + '…' : text;
}

export default async function BlogPage({ searchParams }: { searchParams?: { page?: string } }) {
  const posts = (await fetchPosts()) || [];
  const perPage = 10;

  // parse page from query, default to 1
  let page = 1;
  if (searchParams?.page) {
    const p = parseInt(String(searchParams.page), 10);
    page = Number.isFinite(p) && p > 0 ? p : 1;
  }

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * perPage;
  const pagePosts = posts.slice(start, start + perPage);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>

      {/* 게시판 헤더 */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center bg-gray-100 text-sm text-gray-600 px-4 py-2 rounded-t-md">
        <div className="col-span-1">No.</div>
        <div className="col-span-6">Title</div>
        <div className="col-span-3">Excerpt</div>
        <div className="col-span-2 text-right">Published</div>
      </div>

      <div className="divide-y border rounded-b-md overflow-hidden">
        {pagePosts.length > 0 ? (
          pagePosts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block hover:bg-gray-50">
              <article className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4 md:hover:shadow-sm md:hover:translate-y-0.5 transition-transform duration-150">
                {/* 번호: descending overall number */}
                <div className="md:col-span-1 text-sm text-gray-500">{total - (start + index)}</div>

                {/* 제목 */}
                <div className="md:col-span-6">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 hover:text-blue-600">{post.title}</h2>
                  <div className="mt-1 text-xs text-gray-500 md:hidden">{excerpt(post.content, 80)}</div>
                </div>

                {/* 요약 */}
                <div className="hidden md:block md:col-span-3 text-sm text-gray-600">{excerpt(post.content, 120)}</div>

                {/* 날짜 */}
                <div className="md:col-span-2 text-sm text-gray-500 text-right">{new Date(post.createdAt).toLocaleDateString()}</div>
              </article>
            </Link>
          ))
        ) : (
          <p className="px-4 py-6">No posts yet. Check back later!</p>
        )}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="mt-6 flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-2">Showing {Math.min(start + 1, total)} - {Math.min(start + pagePosts.length, total)} of {total} posts</div>

        <nav className="inline-flex items-center space-x-2">
          <Link
            href={`?page=${Math.max(1, page - 1)}`}
            className={`px-3 py-1 rounded-md border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            aria-disabled={page === 1}
          >
            Prev
          </Link>

          {/* page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}`}
              className={`px-3 py-1 rounded-md border ${p === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={`?page=${Math.min(totalPages, page + 1)}`}
            className={`px-3 py-1 rounded-md border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            aria-disabled={page === totalPages}
          >
            Next
          </Link>
        </nav>
      </div>
    </main>
  );
}
