import { fetchPosts } from '@/lib/api';
import Link from 'next/link';
import SearchFilters from '@/components/SearchFilters';

function excerpt(text: string | undefined, len = 120) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len).trimEnd() + '…' : text;
}

function buildQuery(params: Record<string, any>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
  });
  return qs.toString() ? `?${qs.toString()}` : '';
}

export default async function BlogPage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const posts = (await fetchPosts()) || [];
  const perPage = 10;

  // extract filter params from query
  const titleQuery = searchParams?.q ?? '';
  const dateFrom = searchParams?.from ?? '';
  const dateTo = searchParams?.to ?? '';
  const numMin = searchParams?.min ?? '';
  const numMax = searchParams?.max ?? '';
  const sort = searchParams?.sort ?? 'newest';

  // filtering
  let filtered = posts.slice();

  if (titleQuery) {
    const q = titleQuery.toLowerCase();
    filtered = filtered.filter((p) => (p.title || '').toLowerCase().includes(q));
  }

  if (dateFrom) {
    const from = new Date(dateFrom).getTime();
    if (!Number.isNaN(from)) filtered = filtered.filter((p) => new Date(p.createdAt).getTime() >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo).getTime();
    if (!Number.isNaN(to)) filtered = filtered.filter((p) => new Date(p.createdAt).getTime() <= to);
  }

  if (numMin) {
    const n = parseInt(numMin, 10);
    if (!Number.isNaN(n)) filtered = filtered.filter((_, idx) => idx + 1 >= n);
  }
  if (numMax) {
    const n = parseInt(numMax, 10);
    if (!Number.isNaN(n)) filtered = filtered.filter((_, idx) => idx + 1 <= n);
  }

  // sort
  if (sort === 'oldest') {
    filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    // newest
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // pagination params
  let page = 1;
  if (searchParams?.page) {
    const p = parseInt(searchParams.page as string, 10);
    page = Number.isFinite(p) && p > 0 ? p : 1;
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * perPage;
  const pagePosts = filtered.slice(start, start + perPage);

  // helper to preserve filters when building pagination links
  const baseFilters: Record<string, any> = {
    q: titleQuery || undefined,
    from: dateFrom || undefined,
    to: dateTo || undefined,
    min: numMin || undefined,
    max: numMax || undefined,
    sort: sort || undefined,
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>

      {/* 검색/필터 (토글) */}
      <SearchFilters
        titleQuery={titleQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        numMin={numMin}
        numMax={numMax}
        sort={sort}
      />

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
          <p className="px-4 py-6">No posts match the filters.</p>
        )}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="mt-6 flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-2">Showing {Math.min(start + 1, total)} - {Math.min(start + pagePosts.length, total)} of {total} posts</div>

        <nav className="inline-flex items-center space-x-2">
          <Link
            href={buildQuery({ ...baseFilters, page: Math.max(1, page - 1) })}
            className={`px-3 py-1 rounded-md border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            aria-disabled={page === 1}
          >
            Prev
          </Link>

          {/* page number buttons (limit to reasonable count) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildQuery({ ...baseFilters, page: p })}
              className={`px-3 py-1 rounded-md border ${p === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={buildQuery({ ...baseFilters, page: Math.min(totalPages, page + 1) })}
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
