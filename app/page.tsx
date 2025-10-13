import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>
          Dive into the World of Technology
        </h1>
        <p className={styles.description}>
          Explore, share, and connect with a community of developers and tech enthusiasts.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/blog" className={styles.primaryButton}>
            Explore Blog
          </Link>
          <Link href="/admin/blog/new" className={styles.secondaryButton}>
            Write a Post
          </Link>
        </div>
      </div>
    </main>
  );
}
