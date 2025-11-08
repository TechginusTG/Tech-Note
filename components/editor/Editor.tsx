'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from './FontSize'; // Custom extension
import { useState, useCallback } from 'react';

import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaParagraph, FaHeading, FaListUl, FaListOl,
  FaFileCode, FaQuoteLeft, FaMinus, FaArrowDown, FaImage, FaUndo, FaRedo
} from 'react-icons/fa';

import { Editor as TiptapEditor } from '@tiptap/react';

const MenuBar = ({ editor }: { editor: TiptapEditor | null }) => {
  const addImage = useCallback(() => {
    if (editor) {
      const url = window.prompt('Enter image URL');

      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = event.target.value;
    if (size) {
      editor.chain().focus().setFontSize(`${size}px`).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-t-lg p-2 flex flex-wrap gap-x-4 gap-y-2 items-center">
      {/* Text style group */}
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('bold') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaBold /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('italic') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaItalic /></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('strike') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaStrikethrough /></button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('code') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaCode /></button>
      </div>

      {/* Heading and Paragraph group */}
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('paragraph') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaParagraph /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 1 }) ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaHeading />1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaHeading />2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 3 }) ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaHeading />3</button>
      </div>

      {/* List group */}
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('bulletList') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaListUl /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('orderedList') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaListOl /></button>
      </div>

      {/* Block elements group */}
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('codeBlock') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaFileCode /></button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor.isActive('blockquote') ? 'is-active bg-gray-300 dark:bg-gray-600' : ''}`}><FaQuoteLeft /></button>
      </div>

      {/* Insertables group */}
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><FaMinus /></button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><FaArrowDown /></button>
        <button onClick={addImage} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><FaImage /></button>
      </div>

      {/* Font size */}
      <div>
        <label htmlFor="font-size" className="sr-only">Font size</label>
        <input
          id="font-size"
          type="number"
          min="8"
          max="72"
          placeholder="Size"
          onChange={handleFontSizeChange}
          className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
      </div>

      {/* Undo/Redo group */}
      <div className="flex gap-1 ml-auto">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><FaUndo /></button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><FaRedo /></button>
      </div>
    </div>
  );
};

type EditorProps = {
  onContentChange?: (content: string) => void;
};

export default function Editor({ onContentChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post here...',
      }),
      Image,
      TextStyle,
      FontSize,
    ],
    immediatelyRender: false,
    content: '', // Start with empty content
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none w-full h-96 p-4 overflow-y-auto',
      },
    },
  });

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <MenuBar editor={editor} />
      <div className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}