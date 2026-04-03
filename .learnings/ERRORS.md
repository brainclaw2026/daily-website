# Errors

## [ERR-20260327-001] edit_tool_non_unique_match

**Logged**: 2026-03-27T03:57:35+00:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Edit tool failed because replacement text matched multiple occurrences in sample.ts

### Error
```
Found 2 occurrences of the text in sample.ts. The text must be unique.
```

### Context
- Operation attempted: precise text replacement in sample source cleanup
- File: workspaces/fullstack-dev-assistant/src/lib/ingest/sources/sample.ts
- Cause: replacement snippet was not unique enough

### Suggested Fix
Read the file first and replace with a larger, uniquely identifying block.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/daily-website-clean/workspaces/fullstack-dev-assistant/src/lib/ingest/sources/sample.ts

---
## [ERR-20260327-002] git_push_non_fast_forward

**Logged**: 2026-03-27T05:35:10+00:00
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
Git push failed because remote main advanced after a workflow-created commit.

### Error
```
! [rejected] main -> main (fetch first)
```

### Context
- Operation attempted: push temporary cron schedule change
- Repository: /Users/brain/.openclaw/daily-website-clean
- Likely cause: GitHub Actions/manual run created a new remote commit while local branch was behind

### Suggested Fix
Fetch origin/main, inspect divergence, then rebase local commit onto remote before pushing.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/daily-website-clean/.github/workflows/ingest.yml

---
## [ERR-20260327-003] arxiv_rss_guid_type_mismatch

**Logged**: 2026-03-27T05:56:25+00:00
**Priority**: medium
**Status**: pending
**Area**: backend

### Summary
RSS-based arXiv parser assumed guid was always a string; fast-xml-parser returned an object in some items.

### Error
```
(item.guid || link).replace is not a function
```

### Context
- Operation attempted: replace arXiv API ingest with RSS-based ingest to avoid rate limits
- File: src/lib/ingest/sources/arxiv.ts
- Cause: RSS guid/link field shape differs across entries

### Suggested Fix
Normalize guid/link values to strings before string operations; prefer robust URL extraction and fallback parsing.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/daily-website-clean/workspaces/fullstack-dev-assistant/src/lib/ingest/sources/arxiv.ts

---

## [ERR-20260329-004] git_push_non_fast_forward_after_local_ingest

**Logged**: 2026-03-29T04:38:07.362322+00:00
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
Git push failed after local ingest commit because origin/main had advanced and local main was behind.

### Error
```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/brainclaw2026/daily-website.git'
```

### Context
- Operation attempted: push local content-items.json update for 2026-03-29
- Repository: /Users/brain/.openclaw/daily-website-clean
- Cause: remote main received a newer commit before local push

### Suggested Fix
Fetch origin/main, inspect divergence, then `git pull --rebase origin main` before retrying push.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/daily-website-clean/workspaces/fullstack-dev-assistant/data/content-items.json
- See Also: ERR-20260327-002

---

## [ERR-20260329-005] npm_run_ingest_wrong_directory

**Logged**: 2026-03-29T04:38:25.649109+00:00
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
Re-run ingest failed because npm command was executed from /workspaces instead of the actual site directory.

### Error
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/Users/brain/.openclaw/daily-website-clean/workspaces/package.json'
```

### Context
- Operation attempted: rerun ingest after aborting rebase conflict
- Repository: /Users/brain/.openclaw/daily-website-clean
- Cause: incorrect working directory after using `..` from the project path

### Suggested Fix
Run npm commands from `/Users/brain/.openclaw/daily-website-clean/workspaces/fullstack-dev-assistant` explicitly.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/daily-website-clean/workspaces/fullstack-dev-assistant/package.json

---
## [ERR-20260330-001] github-api-json-python-parse

**Logged**: 2026-03-30T00:00:00Z
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
Tried to parse GitHub API JSON with a Python one-liner but accidentally used Python literal eval assumptions, causing a NameError on JSON booleans.

### Error
```
NameError: name 'false' is not defined
```

### Context
- Command/operation attempted: curl GitHub Actions runs endpoint piped to python3 stdin JSON parser in shell
- Environment: local OpenClaw cron run

### Suggested Fix
Use `python3 -c 'import json,sys; ...'` or `jq` to parse strict JSON instead of embedding JSON into Python code that expects Python literals.

### Metadata
- Reproducible: yes
- Related Files: none

---
