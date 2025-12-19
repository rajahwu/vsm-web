'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-black uppercase tracking-tight mb-6 text-zinc-100 border-b border-zinc-800 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold uppercase tracking-wide mt-8 mb-4 text-teal-400">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-6 mb-3 text-zinc-200">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-zinc-300 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-zinc-300 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-zinc-300 ml-4">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-zinc-300 leading-relaxed">
      {children}
    </li>
  ),
  code: ({ inline, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="bg-zinc-800 text-teal-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-zinc-900 text-zinc-300 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4" {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-teal-600 pl-4 py-2 italic text-zinc-400 my-4">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-zinc-100">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-zinc-300">
      {children}
    </em>
  ),
  hr: () => (
    <hr className="border-zinc-800 my-8" />
  ),
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
