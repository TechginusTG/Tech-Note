// This file contains TypeScript type definitions for data structures
// that are shared between the frontend and the Spring backend.

export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string; // This will likely be HTML content from the editor
  author: User;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
