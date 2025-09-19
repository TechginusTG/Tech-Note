import { fetchPosts } from '@/lib/api';
import PostsRenderer from '@/components/PostsRenderer';
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

  // transform posts for client (add excerpt/thumb/views/count fields expected by PostsRenderer)
  const clientPosts = pagePosts.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    content: p.content,
    excerpt: excerpt(p.content, 120),
    thumb: p.thumb ?? null,
    views: p.views ?? 0,
    count: p.count ?? 0,
    createdAt: p.createdAt,
  }));

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

      <SearchFilters
        titleQuery={titleQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        numMin={numMin}
        numMax={numMax}
        sort={sort}
      />

      <PostsRenderer
        posts={clientPosts}
        total={total}
        start={start}
        perPage={perPage}
        baseFilters={baseFilters}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
