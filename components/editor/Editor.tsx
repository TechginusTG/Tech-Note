'use client';

import { useState } from 'react';
import styles from './Editor.module.css';

// This is a placeholder for a rich text editor.
// You can replace it with a library like React-Quill, Tiptap, or build your own.
export default function Editor() {
  const [content, setContent] = useState('');

  return (
    <div>
      <textarea
        className={styles.editorTextarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your blog post here..."
      />
      <div className={styles.previewWrapper}>
        <h3 className={styles.previewHeading}>Preview</h3>
        <div
          className={`prose ${styles.previewContent}`}
          dangerouslySetInnerHTML={{ __html: content }} // Note: Be careful with XSS, sanitize in a real app
        />
      </div>
    </div>
  );
}

