"use client";
import Link from 'next/link';

type Category = { key: string; name: string; count: number };

const CategoryPanel = ({ categories, currentFilters }: { categories: Category[]; currentFilters?: Record<string, any> }) => {
  const buildQuery = (params: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
    });
    return qs.toString() ? `?${qs.toString()}` : '';
  };

  return (
    <aside className="w-full">
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">카테고리</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/blog" className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50">
              <span>전체보기</span>
            </Link>
          </li>
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
  );
};

export default CategoryPanel;
