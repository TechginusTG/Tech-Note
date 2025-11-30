'use client';

import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';

interface ImageViewProps {
  src: string;
  onClick: () => void;
}

export default function ImageView(props: NodeViewProps) {
  const { node } = props;
  const { src, alt, title } = node.attrs;

  const handleClick = () => {
    // This is where we will open the image editor modal
    if (props.editor.isEditable) {
      // In a real implementation, you would trigger a modal here.
      // For now, we'll just log it.
      console.log('Image clicked, should open editor for:', src);
      
      // We'll need a way to call a function in the parent Editor component.
      // This is a common challenge with Tiptap node views.
      // We can use a custom event or pass a function through editor props.
      
      // Let's assume there's a function on the editor instance to open the editor
      if (typeof (props.editor as any).props.openImageEditor === 'function') {
        (props.editor as any).props.openImageEditor(src);
      }
    }
  };

  return (
    <NodeViewWrapper className="react-component-with-content">
      <img
        src={src}
        alt={alt}
        title={title}
        onClick={handleClick}
        className={`rounded-lg my-4 ${props.editor.isEditable ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' : ''}`}
      />
    </NodeViewWrapper>
  );
}
