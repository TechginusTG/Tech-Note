"use client";
import { useState } from 'react';
import Link from 'next/link';

type Category = { key: string; name: string; count: number };

const CategoryPanel = ({ categories, currentFilters }: { categories: Category[]; currentFilters?: Record<string, any> }) => {
  const [open, setOpen] = useState(false);
  const btnBase = 'inline-flex items-center justify-center h-9 min-w-[46px] px-3 rounded whitespace-nowrap text-sm';

  const buildQuery = (params: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
    });
    return qs.toString() ? `?${qs.toString()}` : '';
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${btnBase} border bg-white hover:bg-gray-50`} aria-expanded={open} aria-controls="category-panel">
        카테고리
      </button>

      {/* Overlay */}
      <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />

        <aside id="category-panel" className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">카테고리</h3>
            <button onClick={() => setOpen(false)} className="px-2 py-1">닫기</button>
          </div>

          <div className="p-4 overflow-auto">
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.key}>
                  <Link href={buildQuery({ ...currentFilters, category: c.key })} className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50">
                    <span>{c.name}</span>
                    <span className="text-sm text-gray-500">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default CategoryPanel;
