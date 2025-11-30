'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './FontSize'; // Custom extension
import { useCallback, useRef, ChangeEvent, useState } from 'react';
import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaParagraph, FaHeading, FaListUl, FaListOl,
  FaFileCode, FaQuoteLeft, FaMinus, FaArrowDown, FaImage, FaUndo, FaRedo, FaSpellCheck, FaPalette
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

  const handleFontFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editor.chain().focus().setFontFamily(event.target.value).run();
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };
  
  const buttonClasses = 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1';
  const activeClasses = 'is-active bg-gray-200 dark:bg-gray-700';

  const inputClasses = "p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500";


  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg p-2 flex flex-wrap items-center gap-x-1 sticky top-0 z-10">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* Undo/Redo Group */}
      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={buttonClasses} title="Undo"><FaUndo /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={buttonClasses} title="Redo"><FaRedo /></button>
      </div>

      {/* Style Group */}
      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${buttonClasses} ${editor.isActive('bold') ? activeClasses : ''}`} title="Bold"><FaBold /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${buttonClasses} ${editor.isActive('italic') ? activeClasses : ''}`} title="Italic"><FaItalic /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`${buttonClasses} ${editor.isActive('strike') ? activeClasses : ''}`} title="Strikethrough"><FaStrikethrough /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={`${buttonClasses} ${editor.isActive('code') ? activeClasses : ''}`} title="Code"><FaCode /></button>
      </div>
      
      {/* Font Group */}
      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">
        <select onChange={handleFontFamilyChange} value={editor.isActive('fontFamily') ? editor.getAttributes('textStyle').fontFamily : ''} className={`${inputClasses} w-28`}>
          <option value="">Default Font</option>
          <option value="Inter">Inter</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
        </select>
        
        <input
          id="font-size"
          type="number"
          min="8"
          max="72"
          placeholder="Size"
          onChange={handleFontSizeChange}
          className={`${inputClasses} w-20`}
        />

        <div className="relative">
          <input
            type="color"
            onChange={handleColorChange}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute opacity-0 w-8 h-8 cursor-pointer"
          />
          <button type="button" className={`${buttonClasses}`} title="Text Color"><FaPalette style={{ color: editor.getAttributes('textStyle').color }} /></button>
        </div>
        <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className={buttonClasses} title="Reset Color">Reset</button>

      </div>

      {/* Heading Group */}
      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`${buttonClasses} ${editor.isActive('paragraph') ? activeClasses : ''}`} title="Paragraph"><FaParagraph /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 1 }) ? activeClasses : ''}`} title="Heading 1"><FaHeading className="w-4 h-4" />1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 2 }) ? activeClasses : ''}`} title="Heading 2"><FaHeading className="w-4 h-4" />2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${buttonClasses} ${editor.isActive('heading', { level: 3 }) ? activeClasses : ''}`} title="Heading 3"><FaHeading className="w-4 h-4" />3</button>
      </div>

      {/* List/Block Group */}
      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClasses} ${editor.isActive('bulletList') ? activeClasses : ''}`} title="Bullet List"><FaListUl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonClasses} ${editor.isActive('orderedList') ? activeClasses : ''}`} title="Ordered List"><FaListOl /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${buttonClasses} ${editor.isActive('codeBlock') ? activeClasses : ''}`} title="Code Block"><FaFileCode /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${buttonClasses} ${editor.isActive('blockquote') ? activeClasses : ''}`} title="Blockquote"><FaQuoteLeft /></button>
      </div>

      {/* Insert Group */}
      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClasses} title="Horizontal Rule"><FaMinus /></button>
        <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()} className={buttonClasses} title="Hard Break"><FaArrowDown /></button>
        <button type="button" onClick={addImage} className={buttonClasses} title="Add Image"><FaImage /></button>
      </div>

      {/* Tools Group */}
      <div className="flex items-center gap-x-1 ml-auto pl-1">
        <button type="button" onClick={toggleSpellCheck} className={`${buttonClasses} ${isSpellCheckActive ? activeClasses : ''}`} title="Spell Check"><FaSpellCheck /></button>
      </div>
    </div>
  );
};

type EditorProps = {
  onContentChange?: (content: string) => void;
  initialContent?: string;
};

export default function Editor({ onContentChange, initialContent }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Start writing your blog post here...' }),
      Image,
      TextStyle,
      FontSize,
      SpellCheckExtension,
      Color,
      FontFamily,
    ],
    immediatelyRender: false,
    content: initialContent || '',
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

  const buttonClasses = 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1';
  const activeClasses = 'is-active bg-gray-200 dark:bg-gray-700';

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <MenuBar editor={editor} />
      {editor && <BubbleMenu editor={editor}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg flex gap-x-1 p-1">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${buttonClasses} ${editor.isActive('bold') ? activeClasses : ''}`}><FaBold /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${buttonClasses} ${editor.isActive('italic') ? activeClasses : ''}`}><FaItalic /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`${buttonClasses} ${editor.isActive('strike') ? activeClasses : ''}`}><FaStrikethrough /></button>
        </div>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  );
};
}