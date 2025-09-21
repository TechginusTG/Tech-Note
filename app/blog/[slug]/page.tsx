import { fetchPostBySlug } from '@/lib/api';
import styles from './page.module.css';

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
      <article className="prose lg:prose-xl">
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.meta}>Published on {new Date(post.createdAt).toLocaleDateString()}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}

