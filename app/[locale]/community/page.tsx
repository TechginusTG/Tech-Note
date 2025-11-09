import PostsRenderer from "@/components/PostsRenderer";
import { fetchPosts } from "@/lib/fetchPosts";
import { Post } from "@/lib/definitions";
import Link from "next/link";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const {
    posts = [],
    totalPosts = 0,
    totalPages = 0,
    currentPage = 1,
  } = await fetchPosts({ page: 1, limit: 10 });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          테크보드
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
