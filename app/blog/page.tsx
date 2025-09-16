import { fetchPosts } from '@/lib/api';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-sm">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-600">{post.title}</h2>
              </Link>
              <p className="text-gray-500 mt-2">Published on {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No posts yet. Check back later!</p>
        )}
      </div>
    </main>
  );
}
