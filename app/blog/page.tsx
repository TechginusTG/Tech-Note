import { fetchPosts } from '@/lib/api';
import PostsRenderer from '@/components/PostsRenderer';
import SearchFilters from '@/components/SearchFilters';
import CategoryPanel from '@/components/CategoryPanel';
import styles from './page.module.css';
import Link from 'next/link';

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

  // compute categories from posts
  const categoryMap: Record<string, { key: string; name: string; count: number }> = {};
  posts.forEach((p: any) => {
    const cat = p.category ?? (Array.isArray(p.tags) && p.tags.length ? p.tags[0] : '기타');
    const key = String(cat);
    if (!categoryMap[key]) categoryMap[key] = { key, name: key, count: 0 };
    categoryMap[key].count += 1;
  });
  const categories = Object.values(categoryMap).sort((a, b) => b.count - a.count);

  // extract filter params from query
  const titleQuery = searchParams?.q ?? '';
  const dateFrom = searchParams?.from ?? '';
  const dateTo = searchParams?.to ?? '';
  const numMin = searchParams?.min ?? '';
  const numMax = searchParams?.max ?? '';
  const sort = searchParams?.sort ?? 'newest';
  const categoryFilter = searchParams?.category ?? '';

  // filtering
  let filtered = posts.slice();

  if (categoryFilter) {
    filtered = filtered.filter((p: any) => {
      const cat = p.category ?? (Array.isArray(p.tags) && p.tags.length ? p.tags[0] : '기타');
      return String(cat) === String(categoryFilter);
    });
  }

  if (titleQuery) {
    const q = titleQuery.toLowerCase();
    filtered = filtered.filter((p: any) => (p.title || '').toLowerCase().includes(q));
  }

  if (dateFrom) {
    const from = new Date(dateFrom).getTime();
    if (!Number.isNaN(from)) filtered = filtered.filter((p: any) => new Date(p.createdAt).getTime() >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo).getTime();
    if (!Number.isNaN(to)) filtered = filtered.filter((p: any) => new Date(p.createdAt).getTime() <= to);
  }

  if (numMin) {
    const n = parseInt(numMin, 10);
    if (!Number.isNaN(n)) filtered = filtered.filter((_: any, idx: number) => idx + 1 >= n);
  }
  if (numMax) {
    const n = parseInt(numMax, 10);
    if (!Number.isNaN(n)) filtered = filtered.filter((_: any, idx: number) => idx + 1 <= n);
  }

  // sort
  if (sort === 'oldest') {
    filtered = filtered.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    // newest
    filtered = filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    category: categoryFilter || undefined,
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <div className={styles.categoryPanel}>
          {/* category panel button */}
          <CategoryPanel categories={categories} currentFilters={baseFilters} />
        </div>
      </div>

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
      <div className={styles.writeButtonContainer}>
        <Link href="/admin/blog/new" className={styles.writeButton}>
          글쓰기
        </Link>
      </div>
    </main>
  );
}
