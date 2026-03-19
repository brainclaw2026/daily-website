# ERRORS

## [ERR-20260319-001] feishu-send-file-path

**Logged**: 2026-03-19T17:16:00+08:00
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
Feishu 发送文件技能文档中的示例脚本路径不存在，导致按文档路径执行发送失败。

### Error
```
Error: Cannot find module '/Users/brain/.openclaw/workspace/scripts/send-feishu-file.mjs'
```

### Context
- Command attempted: node ~/.openclaw/workspace/scripts/send-feishu-file.mjs <file> <to> <receive_id_type>
- Skill doc path: ~/.openclaw/skills/feishu-send-file/SKILL.md
- Actual workspace did not contain that script path

### Suggested Fix
更新技能文档为真实脚本路径，或在该路径补齐发送脚本。

### Metadata
- Reproducible: yes
- Related Files: ~/.openclaw/skills/feishu-send-file/SKILL.md

---
