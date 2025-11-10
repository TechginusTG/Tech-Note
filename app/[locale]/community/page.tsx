import PostsRenderer from "@/components/PostsRenderer";
import { getPosts } from "@/lib/api"; // 변경: lib/api에서 직접 getPosts 호출
import { Post } from "@/lib/definitions";
import Link from "next/link";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  // 변경: authorId 없이 getPosts를 호출하여 모든 게시물을 가져옵니다.
  const {
    posts = [],
    totalPosts = 0,
    totalPages = 0,
    currentPage = 1,
  } = await getPosts({ page: 1, limit: 10 });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          커뮤니티
        </h1>
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
