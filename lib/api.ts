export async function fetchPosts() {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
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
