import PostsRenderer from '@/components/PostsRenderer';
import { fetchPosts } from '@/lib/fetchPosts';
import { Post } from '@/lib/definitions';
import Link from 'next/link';

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { posts = [], totalPosts = 0, totalPages = 0, currentPage = 1 } = await fetchPosts({ page: 1, limit: 10 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog</h1>
        <Link 
          href={`/${locale}/blog/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          글쓰기
        </Link>
      </div>
      <PostsRenderer 
        posts={posts} 
        total={totalPosts} 
        totalPages={totalPages} 
        page={currentPage} 
        baseFilters={{}} 
        perPage={10} 
        start={0} 
      />
    </div>
  );
}
