import { getPostBySlug, getCategoriesWithPostCounts } from "@/lib/api";
import styles from "./page.module.css";
import CategoryPanel from "@/components/CategoryPanel";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const params = await paramsPromise;
  const { slug, locale } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.content?.substring(0, 150),
  };
}

export default async function BlogPostPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise;
  const { slug, locale } = params;

  // 포스트 상세 정보와 카테고리 목록을 병렬로 가져옵니다.
  const [post, categories] = await Promise.all([
    getPostBySlug(slug),
    getCategoriesWithPostCounts(),
  ]);

  if (!post) {
    notFound();
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
        <Link href={`/${locale}/admin/blog/new`} className={styles.writeButton}>
          글쓰기
        </Link>
      </div>
    </main>
  );
}