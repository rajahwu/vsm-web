'use client';
import { getCodexEntry } from '@/lib/codex';
import { MarkdownRenderer } from "./MarkdownRenderer";

interface CodexViewerProps {
  slug?: string;
  onContinue: () => void;
  onSkip?: () => void;
}

export function CodexViewer({ slug, onContinue, onSkip }: CodexViewerProps) {
  if (!slug) {
    // No codex entry, skip directly to next phase
    return (
      <div className="p-6">
        <p className="text-zinc-400 mb-4">No codex entry for this phase.</p>
        <button onClick={onContinue} className="px-4 py-2 bg-teal-600 rounded">Continue</button>
      </div>
    );
  }

  const content = getCodexEntry(slug);

  return (
    <section>
      <MarkdownRenderer content={content} />

      <footer>
        <button onClick={onContinue}>Continue</button>
        {onSkip && <button onClick={onSkip}>Skip</button>}
      </footer>
    </section>
  );
}

