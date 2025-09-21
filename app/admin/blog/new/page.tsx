import Editor from '@/components/editor/Editor';
import styles from './page.module.css';

export default function NewPostPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Create New Post</h1>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            placeholder="Enter post title"
          />
        </div>
        <div className={styles.formGroupLarge}>
          <label className={styles.label}>Content</label>
          <Editor />
        </div>
        <button
          type="submit"
          className={styles.button}
        >
          Publish Post
        </button>
      </form>
    </main>
  );
}
