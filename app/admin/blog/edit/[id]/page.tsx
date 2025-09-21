// This page will be used to edit an existing blog post.
// It would fetch the post data based on the [id] parameter.

import Editor from '@/components/editor/Editor';
import styles from './page.module.css';

type Props = {
  params: { id: string };
};

export default async function EditPostPage({ params }: Props) {
  // const post = await fetchPostById(params.id); // You would implement this function in lib/api.ts

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Edit Post</h1>
      <p className={styles.subtitle}>Editing post with ID: {params.id}</p>
      {/* Pre-fill the form with the fetched post data */}
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            // defaultValue={post?.title}
          />
        </div>
        <div className={styles.formGroupLarge}>
          <label className={styles.label}>Content</label>
          {/* The Editor would need to be initialized with the post content */}
          <Editor />
        </div>
        <button
          type="submit"
          className={styles.updateButton}
        >
          Update Post
        </button>
      </form>
    </main>
  );
}

