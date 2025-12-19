/**
 * Local Codex content map
 * This will later be replaced by @gttm/ritual-codex
 * 
 * Content is embedded directly to avoid fs dependency in client components
 */

const CODEX_CONTENT: Record<string, string> = {
  'protocol-blackout': `# Protocol Blackout

The Shell is fractured. Someone is drilling.

This is your briefing.`,
  
  'genesis': `# Genesis Curriculum

## The Alphabet

Before you can write sentences, you must master the primitives.

- The Dot (•) represents a data point
- The Rectangle (▭) represents a process
- The Diamond (◇) represents a decision
- The Arrow (→) represents causality`,
  
  'powerhouse': `# Powerhouse Track

## Creative Dexterity

Sync your hands with your head. The body leads; the mind follows.

This track trains the connection between physical control and strategic thinking.`,
  
  'transmission-dot': `# The Dot

**Symbol:** •

**Meaning:** A location in space. A data point. An actor.

## Context

Every system begins with discrete elements. Before you can map relationships, you must identify the nodes.

## The Drill

You have 60 seconds. Place 10 dots on paper. Label each with a real actor from your work today—a person, tool, or client.`,
  
  'transmission-rectangle': `# The Rectangle

**Symbol:** ▭

**Meaning:** A process. A container for work. Time bound.

## Context

Work happens inside boxes. Each box consumes time and transforms inputs into outputs.

## The Drill

Draw a single rectangle. Inside, write one verb that describes a task taking at least 30 minutes to complete.`,
  
  'transmission-diamond': `# The Diamond

**Symbol:** ◇

**Meaning:** A decision point. A fork in the path.

## Context

Decisions create branches. Every diamond splits one flow into two or more possible outcomes.`,
};

export function getCodexEntry(slug: string): string {
  const content = CODEX_CONTENT[slug];
  if (!content) {
    return `# Codex Entry Not Found\n\nSlug: ${slug}\n\nThis entry has not been written yet.`;
  }
  return content;
}
