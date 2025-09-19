'use client';
import React, { useState } from 'react';

export default function SearchFilters({ titleQuery, dateFrom, dateTo, numMin, numMax, sort }:
  { titleQuery?: string; dateFrom?: string; dateTo?: string; numMin?: string; numMax?: string; sort?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50"
        aria-expanded={open}
        aria-controls="detailed-search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-1.447.894L9 17l-4.553 2.894A1 1 0 013 19V4z" />
        </svg>
        <span className="text-sm text-gray-700">상세검색</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <form id="detailed-search" method="get" className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
          <input name="q" defaultValue={titleQuery} placeholder="제목 검색..." className="md:col-span-2 px-3 py-2 border rounded-md" />
          <input name="from" type="date" defaultValue={dateFrom} className="px-3 py-2 border rounded-md" />
          <input name="to" type="date" defaultValue={dateTo} className="px-3 py-2 border rounded-md" />
          <input name="min" type="number" defaultValue={numMin} placeholder="최소 번호" className="px-3 py-2 border rounded-md" />
          <input name="max" type="number" defaultValue={numMax} placeholder="최대 번호" className="px-3 py-2 border rounded-md" />
          <div className="flex gap-2 md:col-span-1">
            <select name="sort" defaultValue={sort} className="px-3 py-2 border rounded-md">
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-md">적용</button>
            <a href="/blog" className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md">초기화</a>
          </div>
        </form>
      )}
    </div>
  );
}
