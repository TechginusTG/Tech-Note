'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface ImageEditorProps {
  src: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

const stickerUrls = [
  'https://iconpacks.net/icons/heart-red.png',
  'https://uxwing.com/wp-content/themes/uxwing/download/arts-graphic-shapes/star-icon.png',
];

export default function ImageEditor({ src, onSave, onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const cropRectRef = useRef<fabric.Rect | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });
    fabricCanvasRef.current = canvas;

    fabric.Image.fromURL(src, (img) => {
      img.set({ crossOrigin: 'anonymous', selectable: false });
      const aspectRatio = img.width! / img.height!;
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      let newWidth, newHeight;

      if (aspectRatio > canvasWidth / canvasHeight) {
        newWidth = canvasWidth;
        newHeight = canvasWidth / aspectRatio;
      } else {
        newHeight = canvasHeight;
        newWidth = canvasHeight * aspectRatio;
      }
      
      img.scaleToWidth(newWidth * 0.9);
      img.scaleToHeight(newHeight * 0.9);

      canvas.add(img);
      canvas.centerObject(img);
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });

    return () => {
      canvas.dispose();
    };
  }, [src]);

  const addSticker = (stickerSrc: string) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    fabric.Image.fromURL(stickerSrc, (stickerImg) => {
      stickerImg.scale(0.2);
      canvas.add(stickerImg);
      canvas.centerObject(stickerImg);
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
  };
  
  const toggleCrop = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (!isCropping) {
      setIsCropping(true);
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 150,
        fill: 'rgba(0,0,0,0.3)',
        stroke: '#fff',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      cropRectRef.current = rect;
    } else {
      cancelCrop();
    }
  };

  const applyCrop = () => {
    const canvas = fabricCanvasRef.current;
    const cropRect = cropRectRef.current;
    if (!canvas || !cropRect) return;

    const croppedDataUrl = canvas.toDataURL({
      left: cropRect.left,
      top: cropRect.top,
      width: cropRect.width! * cropRect.scaleX!,
      height: cropRect.height! * cropRect.scaleY!,
      format: 'png',
    });

    // Clear canvas
    canvas.clear();
    
    // Add cropped image back to canvas
    fabric.Image.fromURL(croppedDataUrl, (img) => {
      img.set({ selectable: false });
      canvas.add(img);
      canvas.centerObject(img);
      canvas.renderAll();
    });

    cancelCrop();
  };

  const cancelCrop = () => {
    const canvas = fabricCanvasRef.current;
    const cropRect = cropRectRef.current;
    if (canvas && cropRect) {
      canvas.remove(cropRect);
    }
    cropRectRef.current = null;
    setIsCropping(false);
  };

  const handleSave = () => {
    if (fabricCanvasRef.current) {
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 0.8,
      });
      onSave(dataUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Image Editor</h2>
        <div className="canvas-container border border-gray-300 dark:border-gray-600 mb-4">
          <canvas ref={canvasRef} />
        </div>
        <div className="controls flex flex-wrap items-center gap-4">
          <button onClick={toggleCrop} className={`px-4 py-2 rounded-md ${isCropping ? 'bg-red-500' : 'bg-gray-200'} text-black`}>
            {isCropping ? 'Cancel Crop' : 'Crop'}
          </button>
          {isCropping && (
            <button onClick={applyCrop} className="px-4 py-2 bg-green-500 text-white rounded-md">
              Apply Crop
            </button>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Stickers</h3>
            <div className="flex gap-2">
              {stickerUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => addSticker(url)}
                  className="p-1 border rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <img src={url} alt={`sticker ${index + 1}`} className="w-10 h-10 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="actions mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}