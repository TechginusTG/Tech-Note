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
    <div className="border border-gray-300 rounded-t-md p-2 flex flex-wrap gap-2 items-center">
      {/* Existing buttons */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><FaBold /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><FaItalic /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><FaStrikethrough /></button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}><FaCode /></button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}><FaParagraph /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}><FaHeading />1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}><FaHeading />2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}><FaHeading />3</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><FaListUl /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><FaListOl /></button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}><FaFileCode /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}><FaQuoteLeft /></button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}><FaMinus /></button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}><FaArrowDown /></button>
      
      {/* New features */}
      <button onClick={addImage}><FaImage /></button>
      <div>
        <label htmlFor="font-size" className="sr-only">Font size</label>
        <input
          id="font-size"
          type="number"
          min="8"
          max="72"
          placeholder="Size"
          onChange={handleFontSizeChange}
          className="w-20 p-1 border rounded"
        />
      </div>

      {/* Undo/Redo */}
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}><FaUndo /></button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}><FaRedo /></button>
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
        // Disable heading to use custom font sizes more freely if needed
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
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-96 border border-gray-300 rounded-b-md p-4 overflow-y-auto',
      },
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}