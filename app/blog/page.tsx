import { fetchPosts } from '@/lib/api';
import Link from 'next/link';

function excerpt(text: string | undefined, len = 120) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len).trimEnd() + '…' : text;
}

export default async function BlogPage() {
  const posts = await fetchPosts();

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
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block hover:bg-gray-50">
              <article className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-4 md:hover:shadow-sm md:hover:translate-y-0.5 transition-transform duration-150">
                {/* 번호 */}
                <div className="md:col-span-1 text-sm text-gray-500">{posts.length - index}</div>

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

      {/* 모바일에서 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <Link href="/blog" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View all posts</Link>
      </div>
    </main>
  );
}
