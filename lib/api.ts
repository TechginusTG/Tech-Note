// This file will contain functions to fetch data from the external Spring API.
import { Post } from './definitions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Example function to fetch all posts
export async function fetchPosts(): Promise<Post[]> {
  // In a real application, you would fetch from the API
  // const response = await fetch(`${API_BASE_URL}/api/posts`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch posts');
  // }
  // const data = await response.json();
  // return data;

  // For now, returning empty array as a placeholder
  console.log('Fetching posts from', API_BASE_URL);
  return [];
}

// Example function to fetch a single post by slug
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  console.log(`Fetching post with slug: ${slug}`);
  return null;
}
