'use client';

import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import CodeBlock from './CodeBlock';

function RichTable({ value }: { value: any }) {
  if (!value || !value.rows) return null;

  return (
    <div className="my-10 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-left text-sm leading-relaxed">
        <tbody>
          {value.rows.map((row: any, rowIndex: number) => {
            const isHeaderRow = value.showHeaders && rowIndex === 0;
            return (
              <tr
                key={row._key || rowIndex}
                className={`${isHeaderRow ? 'bg-slate-50/80' : 'hover:bg-slate-50/30'} transition-colors border-b border-slate-100 last:border-0`}
              >
                {row.cells?.map((cell: any, cellIndex: number) => {
                  const CellTag = isHeaderRow ? 'th' : 'td';
                  return (
                    <CellTag
                      key={cell._key || cellIndex}
                      className={`p-4 md:p-5 ${
                        isHeaderRow
                          ? 'font-bold text-slate-900 border-b-2 border-slate-200 uppercase text-[0.7rem] tracking-wider'
                          : 'text-slate-600 border-r border-slate-50 last:border-r-0'
                      }`}
                    >
                      {cell.content ? (
                        <div className="prose prose-sm max-w-none">
                          <PortableText value={cell.content} />
                        </div>
                      ) : (
                        '\u00A0'
                      )}
                    </CellTag>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PostBody({ value }: { value: any[] }) {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          image: ({ value }) => (
            <div className="my-12 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 p-2 bg-slate-50">
              <img
                src={urlFor(value).width(1200).url()}
                alt={value?.alt || value?.caption || 'WebPit blog illustration'}
                className="w-full rounded-[1.5rem]"
              />
            </div>
          ),
          code: ({ value }) => <CodeBlock value={value} />,
          richTableBlock: ({ value }) => <RichTable value={value} />,
        },
      }}
    />
  );
}
