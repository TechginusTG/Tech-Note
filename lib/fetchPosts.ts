import { fetchPosts as _fetchPosts } from './api';

export async function fetchPosts({ page, limit, category }: { page?: number; limit?: number; category?: string; } = {}) {
  return _fetchPosts({ page, limit, category });
}
