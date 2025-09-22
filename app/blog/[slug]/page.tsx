import { fetchPostBySlug } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <h1>{post.title}</h1>
        <p className={styles.date}>Published on {new Date(post.createdAt).toLocaleDateString()}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <div className={styles.writeButtonContainer}>
        <Link href="/admin/blog/new" className={styles.writeButton}>
          글쓰기
        </Link>
      </div>
    </main>
  );
}
