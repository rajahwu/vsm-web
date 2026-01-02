# RDX Readiness Checklist

**Last Updated:** 2025-12-19

---

## Readiness Criteria

- [x] Repository-level reports are stored only in `RDX/reports/`.
- [x] Plans live in `RDX/plans/` and are referenced by TODOs.
- [x] Repository-level TODOs are maintained only under `RDX/todos/`.
- [x] Root README points to the RDX TODO index.
- [x] Legacy TODO/report locations contain stub links to RDX.
- [x] RDX report index (`RDX/reports/INDEX.md`) is current.

## Standard Report Naming Convention

Use the following format for new reports:

`YYYY-MM-DD_HHMM_<author>_<report-type>_<title>.md`

**Report Types (standardized):**
- `audit`
- `completion`
- `migration`
- `integration`
- `build-fix`
- `refactor`
- `analysis`

**Note:** Legacy reports may use non-standard types. New reports must use the standardized list above.

**Example:**
`2025-12-19_0256_codex_migration_rdx-directory-audit.md`
