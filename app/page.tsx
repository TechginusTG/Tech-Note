import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome to Tech-Note</h1>
        <p className={styles.subtitle}>
          Your new platform for tech blogs and community discussions.
        </p>
      </div>

      <div className={styles.grid}>
        <Link href="/blog" className={`${styles.card} ${styles.blogCard}`}>
          <h2 className={styles.cardTitle}>Read the Blog</h2>
          <p>Explore articles and tutorials on the latest in technology.</p>
        </Link>

        <Link href="/admin/blog/new" className={`${styles.card} ${styles.writeCard}`}>
          <h2 className={styles.cardTitle}>Write a Post</h2>
          <p>Share your knowledge and write a new blog post.</p>
        </Link>

        <Link href="/community" className={`${styles.card} ${styles.communityCard}`}>
          <h2 className={styles.cardTitle}>Join the Community</h2>
          <p>Engage in discussions and connect with other developers.</p>
        </Link>
      </div>
    </main>
  );
}

