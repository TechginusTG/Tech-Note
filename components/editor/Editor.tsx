'use client';

import { useState } from 'react';

// This is a placeholder for a rich text editor.
// You can replace it with a library like React-Quill, Tiptap, or build your own.
export default function Editor() {
  const [content, setContent] = useState('');

  return (
    <div>
      <textarea
        className="w-full h-96 p-4 border rounded-md"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your blog post here..."
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div
          className="prose mt-2 p-4 border rounded-md"
          dangerouslySetInnerHTML={{ __html: content }} // Note: Be careful with XSS, sanitize in a real app
        />
      </div>
    </div>
  );
}
