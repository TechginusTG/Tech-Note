import PostsRenderer from '@/components/PostsRenderer';
import { getPosts } from '@/lib/api';
import { Post } from '@/lib/definitions';
import Link from 'next/link';

export default async function UserBlogPage({ params }: { params: { locale: string, username: string } }) {
  const { locale, username } = params;
  const { posts = [], totalPosts = 0, totalPages = 0, currentPage = 1 } = await getPosts({ page: 1, limit: 10, username: username });

  // 포스트, 닉네임, 사용자 이름 순으로 페이지 제목을 정합니다.
  const authorDisplayName = posts[0]?.author.name || posts[0]?.author.nickname || posts[0]?.author.username;
  const pageTitle = authorDisplayName ? `${authorDisplayName}의 블로그` : '블로그';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{pageTitle}</h1>
        <Link 
          href={`/${locale}/blog/user/${username}/new`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>새 글 작성</span>
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
