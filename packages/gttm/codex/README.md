# @gttm/codex

**The Knowledge Registry**

This package acts as the central repository for static content, lore, and "Codex" entries used across the VSM ecosystem.

## Usage

### `getCodexEntry(slug)`
Retrieves the markdown content for a specific concept slug.

```ts
import { getCodexEntry } from '@gttm/codex';

const content = getCodexEntry('protocol-blackout');
// Returns markdown string
```

## Future Roadmap
- Support for remote content fetching (CMS integration).
- Richer metadata for codex entries (tags, related cards).
