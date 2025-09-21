
'use client';

import React from 'react';

export default function BlogSettingsModal({
  open,
  onClose,
  view,
  setView,
  theme,
  setTheme,
}: {
  open: boolean;
  onClose: () => void;
  view: 'list' | 'tile';
  setView: (v: 'list' | 'tile') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-md shadow-lg z-10 w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold mb-4">보기 설정</h2>

        <div className="flex flex-col gap-3">
          <label className={`inline-flex items-center gap-2 p-2 rounded cursor-pointer ${view === 'list' ? 'bg-gray-100' : ''}`}>
            <input
              type="radio"
              name="blog-view"
              checked={view === 'list'}
              onChange={() => setView('list')}
            />
            <span>목록형 보기</span>
          </label>

          <label className={`inline-flex items-center gap-2 p-2 rounded cursor-pointer ${view === 'tile' ? 'bg-gray-100' : ''}`}>
            <input
              type="radio"
              name="blog-view"
              checked={view === 'tile'}
              onChange={() => setView('tile')}
            />
            <span>타일형 보기</span>
          </label>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">테마</h3>
          <div className="flex flex-col gap-2">
            <label className={`inline-flex items-center gap-2 p-2 rounded cursor-pointer ${theme === 'light' ? 'bg-gray-100' : ''}`}>
              <input type="radio" name="blog-theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
              <span>라이트 모드</span>
            </label>

            <label className={`inline-flex items-center gap-2 p-2 rounded cursor-pointer ${theme === 'dark' ? 'bg-gray-100' : ''}`}>
              <input type="radio" name="blog-theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
              <span>다크 모드</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">취소</button>
          <button onClick={onClose} className="px-4 py-2 rounded bg-blue-600 text-white">저장</button>
        </div>
      </div>
    </div>
  );
}
