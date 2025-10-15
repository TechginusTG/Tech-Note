import PostsRenderer from '@/components/PostsRenderer';
import { fetchPosts } from '@/lib/fetchPosts';
import { Post } from '@/lib/definitions';

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { posts = [], totalPosts = 0, totalPages = 0, currentPage = 1 } = await fetchPosts({ page: 1, limit: 10 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
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
