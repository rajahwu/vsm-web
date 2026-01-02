# RDX Re-implementation and Migration Guide

Date: 2025-12-20 14:24
Author: codex

## Adoption Strategy (New Projects)

1) **Create the base RDX structure**
- `RDX/README.md`
- `RDX/readiness.md`
- `RDX/TODO.md`
- `RDX/reports/`
- `RDX/plans/`
- `RDX/todos/`

2) **Define the naming standard**
- Use `YYYY-MM-DD_HHMM_<author>_<report-type>_<title>.md`.
- Keep report types limited to a small set (audit, completion, migration, integration, build-fix, refactor, analysis).

3) **Introduce report metadata**
- Add a short header block to each report:
  - Date, Author, Scope, Status (draft/final).
- Require a one-paragraph executive summary.

4) **Create a report index**
- Add `RDX/reports/INDEX.md` listing reports by date/type/topic.
- Update it whenever a new report is added.

5) **Establish update discipline**
- `RDX/TODO.md` should list all active todo files.
- Add a monthly cleanup step: archive or consolidate outdated reports.

## Migration Plan (Existing Projects)

1) **Inventory and classify**
- List all existing docs and map them to: report, plan, todo, note, or reference.
- Identify duplicate or obsolete documents.

2) **Create the RDX structure**
- Create `RDX/` with the standard subfolders.
- Add initial `RDX/README.md` and `RDX/readiness.md`.

3) **Move and rename**
- Move all reports into `RDX/reports/` and rename to the standard format.
- Move plans into `RDX/plans/` and todos into `RDX/todos/`.
- Replace old paths with stub links pointing to the new locations.

4) **Build indexes**
- Update `RDX/TODO.md` to list all todo files.
- Create `RDX/reports/INDEX.md` to list all reports and their scope.

5) **Validate references**
- Scan the repo for old paths and update them to new RDX locations.
- Confirm internal references in reports/plans still resolve.

6) **Communicate and freeze**
- Announce a migration window and discourage parallel edits.
- After migration, re-open changes and review diffs for lost content.

**Best practices**
- Use consistent author tags.
- Keep report titles short and descriptive.
- Avoid new ad-hoc report types; add to the standard list instead.

**Potential pitfalls**
- Broken links due to un-updated references.
- Duplicate reports caused by inconsistent naming.
- Stale TODO indexes if not updated with new files.

**Communication plan**
- Post a migration notice with the cutover date.
- Provide a quick reference to the new structure in the root README.
- Assign a single owner to approve new report additions for the first two weeks.

## Technical Specifications

**Prerequisites**
- Git repository with write access for doc migrations.
- A baseline Markdown linter (optional) to enforce headers and metadata blocks.

**Required structure**
- `RDX/README.md`
- `RDX/readiness.md`
- `RDX/TODO.md`
- `RDX/reports/`
- `RDX/plans/`
- `RDX/todos/`

**Naming policy**
- `YYYY-MM-DD_HHMM_<author>_<report-type>_<title>.md`

**Recommended automation**
- A lightweight script to:
  - Validate report naming.
  - Regenerate `RDX/reports/INDEX.md` and `RDX/TODO.md`.
- Optional CI check to block reports that do not match the naming standard.

**Security guidance**
- Do not store secrets, credentials, or user data in RDX reports.
- Redact sensitive system identifiers before publishing audit logs.
