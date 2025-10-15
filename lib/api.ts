export async function fetchPosts({ page, limit, category }: { page?: number; limit?: number; category?: string; } = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);

    const response = await fetch(`/api/posts?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { posts: [], totalPages: 0, currentPage: 1 };
  }
}

export async function fetchPostBySlug(slug: string) {
  try {
    const response = await fetch(`/api/posts/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return null;
  }
}
