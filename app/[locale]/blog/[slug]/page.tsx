import { getPostBySlug, getCategoriesWithPostCounts } from "@/lib/api";
import styles from "./page.module.css";
import CategoryPanel from "@/components/CategoryPanel";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  // 포스트 상세 정보와 카테고리 목록을 병렬로 가져옵니다.
  const [post, categories] = await Promise.all([
    getPostBySlug(params.slug),
    getCategoriesWithPostCounts(),
  ]);

  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <article className={styles.article}>
            <h1>{post.title}</h1>
            <p className={styles.date}>
              by {post.author.name || post.author.nickname} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
        <div className={styles.sidebar}>
          <CategoryPanel categories={categories} currentFilters={{}} />
        </div>
      </div>

      <div className={styles.writeButtonContainer}>
        <Link href="/admin/blog/new" className={styles.writeButton}>
          글쓰기
        </Link>
      </div>
    </main>
  );
}
