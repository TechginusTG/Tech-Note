import PostsRenderer from '@/components/PostsRenderer';
import { fetchPosts } from '@/lib/fetchPosts';
import Link from 'next/link';

export default async function CommunityPage({ params }: { params: { locale:string } }) {
  const { locale } = params;
  const { posts = [], totalPosts = 0, totalPages = 0, currentPage = 1 } = await fetchPosts({ page: 1, limit: 10, category: 'community' });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Community</h1>

      <PostsRenderer 
        posts={posts} 
        total={totalPosts} 
        totalPages={totalPages} 
        page={currentPage} 
        baseFilters={{}} 
        perPage={10} 
        start={0} 
      />
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <Link
          href="/admin/blog/new?category=community"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}
        >
          Write
        </Link>
      </div>
    </div>
  );
}