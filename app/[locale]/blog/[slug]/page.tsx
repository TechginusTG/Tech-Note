import CategoryPanel from "@/components/CategoryPanel";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCategoriesWithPostCounts, getPostBySlug } from "@/lib/api";
import Link from "next/link";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

type Params = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.content?.substring(0, 150),
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { locale, slug } = await params;

  const [post, categories, session] = await Promise.all([
    getPostBySlug(slug),
    getCategoriesWithPostCounts(),
    getServerSession(authOptions),
  ]);

  if (!post) {
    notFound();
  }

  const canEdit = session?.user?.id === post.authorId;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <article className={styles.article}>
            <h1>{post.title}</h1>
            <p className={styles.date}>
              by {post.author.name || post.author.nickname} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </article>
        </div>
        <div className={styles.sidebar}>
          <CategoryPanel categories={categories} currentFilters={{}} />
        </div>
      </div>

      {canEdit && (
        <div className={styles.writeButtonContainer}>
          <Link
            href={`/${locale}/admin/blog/edit/${post.id}`}
            className={styles.writeButton}
          >
            글 수정
          </Link>
        </div>
      )}
    </main>
  );
}
