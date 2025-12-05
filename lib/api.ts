import prisma from "@/lib/prisma";

interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  authorId?: string; // authorId is the user's ID
}

/**
 * Fetches a list of posts directly from the database.
 * Can be filtered by category and/or author.
 * @param params - Filtering and pagination options.
 * @returns A list of posts and pagination details.
 */
export async function getPosts({
  page = 1,
  limit = 10,
  category,
  username,
  includeDrafts = false,
}: {
  page?: number;
  limit?: number;
  category?: string;
  username?: string;
  includeDrafts?: boolean;
} = {}) {
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (!includeDrafts) {
      where.published = true;
    }
    if (category) {
      where.category = { name: category };
    }
    if (username) {
      where.author = {
        is: {
          username,
        },
      };
    }

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / limit);

    return { posts, totalPosts, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], totalPosts: 0, totalPages: 0, currentPage: 1 };
  }
}

/**
 * Fetches a single post by its slug directly from the database.
 * @param slug - The slug of the post to fetch.
 * @returns The post object or null if not found.
 */
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    return post;
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches all categories along with the number of posts in each.
 * @returns A list of categories with their post counts, sorted by count.
 */
export async function getCategoriesWithPostCounts() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        posts: {
          some: {
            published: true,
          }
        }
      },
      include: {
        _count: {
          select: {
            posts: { where: { published: true } }, // 공개된 포스트만 카운트
          },
        },
      },
    });
    
    return categories.map(c => ({
      key: c.name,
      name: c.name,
      count: c._count.posts,
    })).sort((a, b) => b.count - a.count); // 카운트 순으로 정렬
  } catch (error) {
    console.error("Failed to fetch categories with post counts:", error);
    return [];
  }
}
