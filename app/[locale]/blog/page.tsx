import PostsRenderer from "@/components/features/blog/PostsRenderer";
import { getPosts } from "@/lib/api";
import Link from "next/link";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const {
    posts = [],
    totalPosts = 0,
    totalPages = 0,
    currentPage = 1,
  } = await getPosts({ page: 1, limit: 10, category: "blog" });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          블로그
        </h1>
        <Link href={`/${locale}/admin/blog/new`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          새 글 작성
        </Link>
      </div>
      <PostsRenderer
        posts={posts}
        total={totalPosts}
        totalPages={totalPages}
        page={currentPage}
        baseFilters={{ category: "blog" }}
        perPage={10}
        start={0}
      />
    </div>
  );
}