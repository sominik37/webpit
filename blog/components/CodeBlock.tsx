'use client';

import { useCallback, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);

interface CodeBlockValue {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ value }: { value: CodeBlockValue }) {
  const [copied, setCopied] = useState(false);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value.code ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [value.code]);

  const language = value.language?.toLowerCase() ?? 'code';

  return (
    <div
      style={{
        margin: '2rem 0',
        borderRadius: '0.875rem',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        background: '#0f172a',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        fontSize: '0.89rem',
        lineHeight: '1.7',
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Consolas, monospace',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1rem',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              padding: '2px 10px',
              borderRadius: '999px',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {language}
          </span>
          {value.filename && <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{value.filename}</span>}
        </div>
        <button
          onClick={copyCode}
          title="Copy code"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: copied ? '#22c55e22' : 'transparent',
            border: `1px solid ${copied ? '#22c55e' : '#334155'}`,
            color: copied ? '#22c55e' : '#94a3b8',
            borderRadius: '0.4rem',
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>{' '}
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>{' '}
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div style={{ overflowX: 'auto', fontSize: '0.9rem' }}>
        <SyntaxHighlighter
          language={language === 'js' ? 'javascript' : language === 'ts' ? 'typescript' : language}
          style={vscDarkPlus}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#0f172a',
          }}
          lineNumberStyle={{
            minWidth: '2.5rem',
            paddingRight: '1rem',
            color: '#475569',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: '1px solid #1e293b',
            marginRight: '1rem',
          }}
        >
          {value.code ?? ''}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
