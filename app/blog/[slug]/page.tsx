import { fetchPostBySlug, fetchPosts } from "@/lib/prisma";
import styles from "./page.module.css";
import CategoryPanel from "@/components/CategoryPanel";

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  const post = await fetchPostBySlug(params.slug);
  const posts = await fetchPosts() || [];

  if (!post) {
    return <div>Post not found!</div>;
  }

  // compute categories from posts
  const categoryMap: Record<
    string,
    { key: string; name: string; count: number }
  > = {};
  posts.forEach((p: any) => {
    const cat =
      p.category ??
      (Array.isArray(p.tags) && p.tags.length ? p.tags[0] : "기타");
    const key = String(cat);
    if (!categoryMap[key]) categoryMap[key] = { key, name: key, count: 0 };
    categoryMap[key].count += 1;
  });
  const categories = Object.values(categoryMap).sort(
    (a, b) => b.count - a.count,
  );


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <article className={styles.article}>
            <h1>{post.title}</h1>
            <p className={styles.date}>
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
        <div className={styles.sidebar}>
            <CategoryPanel categories={categories} />
        </div>
      </div>
    </main>
  );
}

