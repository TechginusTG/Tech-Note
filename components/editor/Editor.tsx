'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from './FontSize'; // Custom extension
import { useCallback, useRef, ChangeEvent, useState } from 'react';
import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaParagraph, FaHeading, FaListUl, FaListOl,
  FaFileCode, FaQuoteLeft, FaMinus, FaArrowDown, FaImage, FaUndo, FaRedo, FaSpellCheck
} from 'react-icons/fa';
import { Editor as TiptapEditor } from '@tiptap/react';
import { SpellCheckExtension, spellCheckPluginKey } from './SpellCheckExtension';

const MenuBar = ({ editor }: { editor: TiptapEditor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSpellCheckActive, setIsSpellCheckActive] = useState(false);

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

  const toggleSpellCheck = useCallback(async () => {
    if (!editor) return;

    if (isSpellCheckActive) {
      const { view } = editor;
      const transaction = view.state.tr.setMeta(spellCheckPluginKey, { matches: [] });
      view.dispatch(transaction);
      setIsSpellCheckActive(false);
      return;
    }

    const text = editor.getText();
    if (!text.trim()) {
      alert('내용이 없습니다.');
      return;
    }

    alert('맞춤법 검사를 시작합니다...');

    try {
      const response = await fetch('/api/spellcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Spell check API failed');
      }

      const result = await response.json();
      
      if (result.matches.length === 0) {
        alert('맞춤법 오류를 찾지 못했습니다.');
        return;
      }

      const matches = result.matches.map((match: any) => ({
        from: match.offset + 1,
        to: match.offset + match.length + 1,
        message: match.message,
        replacements: match.replacements,
      }));

      const { view } = editor;
      const transaction = view.state.tr.setMeta(spellCheckPluginKey, { matches });
      view.dispatch(transaction);
      setIsSpellCheckActive(true);

    } catch (error) {
      console.error('Error checking spelling:', error);
      alert(`맞춤법 검사 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [editor, isSpellCheckActive]);


  if (!editor) {
    return null;
  }

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = event.target.value;
    editor.chain().focus().setFontSize(size ? `${size}px` : '').run();
  };

  const buttonClasses = 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const activeClasses = 'is-active bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200';

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg p-2 flex flex-wrap items-center gap-x-1 sticky top-0 z-10">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      <div className="flex items-center gap-x-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${buttonClasses} ${editor.isActive('bold') ? activeClasses : ''}`}><FaBold /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${buttonClasses} ${editor.isActive('italic') ? activeClasses : ''}`}><FaItalic /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`${buttonClasses} ${editor.isActive('strike') ? activeClasses : ''}`}><FaStrikethrough /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={`${buttonClasses} ${editor.isActive('code') ? activeClasses : ''}`}><FaCode /></button>
      </div>
      
      <div className="flex items-center gap-x-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`${buttonClasses} ${editor.isActive('paragraph') ? activeClasses : ''}`}><FaParagraph /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 1 }) ? activeClasses : ''}`}><FaHeading className="w-4 h-4 inline-block mr-1" />1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 2 }) ? activeClasses : ''}`}><FaHeading className="w-4 h-4 inline-block mr-1" />2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 3 }) ? activeClasses : ''}`}><FaHeading className="w-4 h-4 inline-block mr-1" />3</button>
      </div>

      <div className="flex items-center gap-x-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClasses} ${editor.isActive('bulletList') ? activeClasses : ''}`}><FaListUl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonClasses} ${editor.isActive('orderedList') ? activeClasses : ''}`}><FaListOl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${buttonClasses} ${editor.isActive('codeBlock') ? activeClasses : ''}`}><FaFileCode /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${buttonClasses} ${editor.isActive('blockquote') ? activeClasses : ''}`}><FaQuoteLeft /></button>
      </div>

      <div className="flex items-center gap-x-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClasses}><FaMinus /></button>
        <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()} className={buttonClasses}><FaArrowDown /></button>
        <button type="button" onClick={addImage} className={buttonClasses}><FaImage /></button>
      </div>
      
      <div className="flex items-center gap-x-2">
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

      <div className="flex items-center gap-x-1 ml-auto pl-2">
        <button type="button" onClick={toggleSpellCheck} className={`${buttonClasses} ${isSpellCheckActive ? activeClasses : ''}`}><FaSpellCheck /></button>
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
      SpellCheckExtension,
    ],
    immediatelyRender: false,
    content: '',
    onUpdate: ({ editor }) => {
      onContentChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none w-full min-h-[400px] p-6',
        spellcheck: 'false', // Disable browser spellcheck to avoid duplicate underlines
      },
    },
  });

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}