'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from './FontSize'; // Custom extension
import { useCallback, useRef, ChangeEvent } from 'react';
import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaParagraph, FaHeading, FaListUl, FaListOl,
  FaFileCode, FaQuoteLeft, FaMinus, FaArrowDown, FaImage, FaUndo, FaRedo, FaSpellCheck
} from 'react-icons/fa';
import { Editor as TiptapEditor } from '@tiptap/react';

const MenuBar = ({ editor }: { editor: TiptapEditor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success && result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        alert('Image upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. See console for details.');
    }
  }, [editor]);

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const checkSpelling = useCallback(async () => {
    if (!editor) return;

    const text = editor.getText();
    if (!text.trim()) {
      alert('내용이 없습니다.');
      return;
    }

    alert('맞춤법 검사를 시작합니다...');

    try {
      const params = new URLSearchParams();
      params.append('text', text);
      params.append('language', 'ko-KR');

      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const result = await response.json();

      if (result.matches.length === 0) {
        alert('맞춤법 오류를 찾지 못했습니다.');
      } else {
        const suggestions = result.matches.map((match: any) => {
          return `- "${match.context.text}"\n  - 오류: ${match.message}\n  - 추천: ${match.replacements.map((r: any) => r.value).join(', ')}`;
        }).join('\n\n');
        alert(`맞춤법 검사 결과:\n\n${suggestions}`);
      }
    } catch (error) {
      console.error('Error checking spelling:', error);
      alert('맞춤법 검사 중 오류가 발생했습니다.');
    }
  }, [editor]);


  if (!editor) {
    return null;
  }

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = event.target.value;
    editor.chain().focus().setFontSize(size ? `${size}px` : '').run();
  };

  const buttonClasses = 'p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors';
  const activeClasses = 'is-active bg-slate-200 dark:bg-slate-700';

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 rounded-t-xl p-2 flex flex-wrap items-center gap-x-1">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${buttonClasses} ${editor.isActive('bold') ? activeClasses : ''}`}><FaBold /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${buttonClasses} ${editor.isActive('italic') ? activeClasses : ''}`}><FaItalic /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`${buttonClasses} ${editor.isActive('strike') ? activeClasses : ''}`}><FaStrikethrough /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={`${buttonClasses} ${editor.isActive('code') ? activeClasses : ''}`}><FaCode /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 px-2">
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`${buttonClasses} ${editor.isActive('paragraph') ? activeClasses : ''}`}><FaParagraph /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 1 }) ? activeClasses : ''}`}><FaHeading className="w-4 h-4" />1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 2 }) ? activeClasses : ''}`}><FaHeading className="w-4 h-4" />2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 3 }) ? activeClasses : ''}`}><FaHeading className="w-4 h-4" />3</button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 px-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClasses} ${editor.isActive('bulletList') ? activeClasses : ''}`}><FaListUl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonClasses} ${editor.isActive('orderedList') ? activeClasses : ''}`}><FaListOl /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 px-2">
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${buttonClasses} ${editor.isActive('codeBlock') ? activeClasses : ''}`}><FaFileCode /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${buttonClasses} ${editor.isActive('blockquote') ? activeClasses : ''}`}><FaQuoteLeft /></button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 px-2">
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClasses}><FaMinus /></button>
        <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()} className={buttonClasses}><FaArrowDown /></button>
        <button type="button" onClick={addImage} className={buttonClasses}><FaImage /></button>
      </div>

      <div className="flex items-center px-2">
        <label htmlFor="font-size" className="sr-only">Font size</label>
        <input
          id="font-size"
          type="number"
          min="8"
          max="72"
          placeholder="Size"
          onChange={handleFontSizeChange}
          className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto pl-2">
        <button type="button" onClick={checkSpelling} className={buttonClasses}><FaSpellCheck /></button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={buttonClasses}><FaUndo /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={buttonClasses}><FaRedo /></button>
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
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Start writing your blog post here...' }),
      Image,
      TextStyle,
      FontSize,
    ],
    immediatelyRender: false,
    content: '',
    onUpdate: ({ editor }) => {
      onContentChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none w-full h-96 p-6 overflow-y-auto',
        spellcheck: 'true',
      },
    },
  });

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <MenuBar editor={editor} />
      <div className="p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}