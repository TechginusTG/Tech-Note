'use client';

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './FontSize'; // Custom extension
import { useCallback, useRef, ChangeEvent, useState, useEffect } from 'react';
import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaParagraph, FaHeading, FaListUl, FaListOl,
  FaFileCode, FaQuoteLeft, FaMinus, FaArrowDown, FaImage, FaUndo, FaRedo, FaSpellCheck, FaPalette
} from 'react-icons/fa';
import { Editor as TiptapEditor } from '@tiptap/react';
import { SpellCheckExtension, spellCheckPluginKey } from './SpellCheckExtension';
import ImageEditor from './ImageEditor';
import ImageView from './ImageView';

const MenuBar = ({ editor }: { editor: TiptapEditor | null }) => {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSpellCheckActive, setIsSpellCheckActive] = useState(false);

  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const fontDropdownRef = useRef<HTMLDivElement>(null);

  const moreDropdownRef = useRef<HTMLDivElement>(null);



  const fontFamilies = [

    { name: 'Default Font', value: '' },

    { name: 'Inter', value: 'Inter' },

    { name: 'Sans-serif', value: 'sans-serif' },

    { name: 'Serif', value: 'serif' },

    { name: 'Monospace', value: 'monospace' },

    { name: 'Cursive', value: 'cursive' },

  ];



  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {

        setIsFontDropdownOpen(false);

      }

      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {

        setIsMoreDropdownOpen(false);

      }

    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, []);



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



  const selectFontFamily = (fontFamily: string) => {

    if (fontFamily === '') {

      editor.chain().focus().unsetFontFamily().run();

    } else {

      editor.chain().focus().setFontFamily(fontFamily).run();

    }

    setIsFontDropdownOpen(false);

  };



  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    editor.chain().focus().setColor(event.target.value).run();

  };



  const buttonClasses = 'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1';

  const activeClasses = 'is-active bg-gray-200 dark:bg-gray-700';



  const inputClasses = "p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500";





  const currentFontFamily = editor.getAttributes('textStyle').fontFamily || '';

  const currentFont = fontFamilies.find(font => font.value === currentFontFamily) || fontFamilies[0];



  return (

    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg p-2 flex flex-wrap items-center gap-x-1 sticky top-0 z-10">

      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />



      {/* Undo/Redo Group */}

      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">

        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={buttonClasses} title="Undo"><FaUndo /></button>

        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={buttonClasses} title="Redo"><FaRedo /></button>

      </div>



      {/* Font Group */}

      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">

        <div className="relative" ref={fontDropdownRef}>

          <button type="button" onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)} className={`${inputClasses} w-32 flex justify-between items-center`}>

            <span style={{ fontFamily: currentFont.value }}>{currentFont.name}</span>

            <span>▼</span>

          </button>

          {isFontDropdownOpen && (

            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">

              {fontFamilies.map(font => (

                <button

                  key={font.name}

                  type="button"

                  onClick={() => selectFontFamily(font.value)}

                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('textStyle', { fontFamily: font.value }) ? 'bg-gray-200 dark:bg-gray-600' : ''}`}

                  style={{ fontFamily: font.value }}

                >

                  {font.name}

                </button>

              ))}

            </div>

          )}

        </div>

        <input id="font-size" type="number" min="8" max="72" placeholder="Size" onChange={handleFontSizeChange} className={`${inputClasses} w-20`} />

      </div>

      

      {/* Style Group */}

      <div className="flex items-center gap-x-1 border-r border-gray-200 dark:border-gray-600 pr-1 mr-1">

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${buttonClasses} ${editor.isActive('bold') ? activeClasses : ''}`} title="Bold"><FaBold /></button>

        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${buttonClasses} ${editor.isActive('italic') ? activeClasses : ''}`} title="Italic"><FaItalic /></button>

        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`${buttonClasses} ${editor.isActive('strike') ? activeClasses : ''}`} title="Strikethrough"><FaStrikethrough /></button>

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

        <button type="button" onClick={addImage} className={buttonClasses} title="Add Image"><FaImage /></button>

      </div>



      {/* More Options Dropdown */}

      <div className="relative" ref={moreDropdownRef}>

        <button type="button" onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)} className={buttonClasses} title="More options">

          More...

        </button>

        {isMoreDropdownOpen && (

          <div className="absolute top-full right-0 mt-1 w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 p-2 flex flex-col gap-2">

            

            {/* Color */}

            <div className="flex items-center gap-x-2">

              <label>Color:</label>

              <div className="relative">

                <input type="color" onChange={handleColorChange} value={editor.getAttributes('textStyle').color || '#000000'} className="absolute opacity-0 w-8 h-8 cursor-pointer" />

                <button type="button" className={`${buttonClasses}`} title="Text Color"><FaPalette style={{ color: editor.getAttributes('textStyle').color }} /></button>

              </div>

              <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className={buttonClasses} title="Reset Color">Reset</button>

            </div>



            {/* Advanced Blocks */}

            <div className="flex items-center gap-x-1 border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">

              <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={`${buttonClasses} ${editor.isActive('code') ? activeClasses : ''}`} title="Code"><FaCode /></button>

              <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`${buttonClasses} ${editor.isActive('codeBlock') ? activeClasses : ''}`} title="Code Block"><FaFileCode /></button>

              <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${buttonClasses} ${editor.isActive('blockquote') ? activeClasses : ''}`} title="Blockquote"><FaQuoteLeft /></button>

            </div>



            {/* Insert */}

            <div className="flex items-center gap-x-1">

              <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClasses} title="Horizontal Rule"><FaMinus /></button>

              <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()} className={buttonClasses} title="Hard Break"><FaArrowDown /></button>

            </div>

            

            {/* Tools */}

            <div className="flex items-center gap-x-1 border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">

              <button type="button" onClick={toggleSpellCheck} className={`${buttonClasses} ${isSpellCheckActive ? activeClasses : ''}`} title="Spell Check"><FaSpellCheck /></button>

            </div>



          </div>

        )}

      </div>

    </div>

  );

};

type EditorProps = {
  onContentChange?: (content: string) => void;
  initialContent?: string;
};

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default function Editor({ onContentChange, initialContent }: EditorProps) {
  const [editingImageSrc, setEditingImageSrc] = useState<string | null>(null);

  const openImageEditor = (src: string) => {
    setEditingImageSrc(src);
  };

  const closeImageEditor = () => {
    setEditingImageSrc(null);
  };

  const handleSaveImage = async (dataUrl: string) => {
    if (!editor) return;

    // 1. Convert data URL to Blob
    const blob = await fetch(dataUrl).then(res => res.blob());
    const file = new File([blob], "edited-image.png", { type: "image/png" });

    // 2. Upload to server
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();

      if (result.success && result.url) {
        const newSrc = result.url;
        const oldSrc = editingImageSrc;

        // 3. Update the image src in the editor
        editor.chain().focus().command(({ tr }) => {
          let imageNodePos: number | undefined;
          tr.doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs.src === oldSrc) {
              imageNodePos = pos;
            }
          });

          if (imageNodePos !== undefined) {
            tr.setNodeMarkup(imageNodePos, undefined, { ...tr.doc.nodeAt(imageNodePos)!.attrs, src: newSrc });
            return true;
          }
          return false;
        }).run();
        
        closeImageEditor();
      } else {
        alert('Image upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading edited image:', error);
      alert('Error uploading edited image. See console for details.');
    }
  };
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Start writing your blog post here...' }),
      CustomImage,
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
        spellcheck: 'false',
      },
      // @ts-ignore
      openImageEditor: openImageEditor,
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
      {editingImageSrc && (
        <ImageEditor
          src={editingImageSrc}
          onSave={handleSaveImage}
          onClose={closeImageEditor}
        />
      )}
    </div>
  );
};