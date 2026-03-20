## [ERR-20260319-001] pdf_generator_missing_markdown_dependency

**Logged**: 2026-03-19T18:25:00+08:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Workspace PDF generation script failed because it imports the `markdown` module, which is not installed in the current Python environment.

### Error
```
Traceback (most recent call last):
  File "/Users/brain/.openclaw/workspace/scripts/pdf_generator.py", line 11, in <module>
    import markdown
ModuleNotFoundError: No module named 'markdown'
```

### Context
- Command attempted: `python3 scripts/pdf_generator.py <input.md> <output.pdf>`
- Environment: local workspace Python3 on macOS
- Fallback used: direct ReportLab-based inline conversion without markdown dependency

### Suggested Fix
Remove the unused `import markdown` dependency from `scripts/pdf_generator.py`, or vendor/install the package explicitly before calling the script.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/workspace/scripts/pdf_generator.py

---
