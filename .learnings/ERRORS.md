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

## [ERR-20260319-FEISHU-SCRIPT] send_file_path_lookup

**Logged**: 2026-03-19T20:43:00+08:00
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
Initially assumed the Feishu send-file script was missing without exhaustively searching workspace and OpenClaw paths.

### Error
```
Told user the send script path was missing before fully checking workspace and ~/.openclaw for Feishu/Lark file-send scripts.
```

### Context
- User requested PDF attachment sending
- Skill indicated a script-based send path should exist
- Need to search more carefully before concluding tooling is absent

### Suggested Fix
Search workspace and ~/.openclaw for Feishu/Lark send/upload scripts and common API usage patterns before reporting a missing script.

### Metadata
- Reproducible: yes
- Related Files: ~/.openclaw/skills/feishu-send-file/SKILL.md

---

## [ERR-20260319-CRON400] daily academic report manual run failed

**Logged**: 2026-03-19T15:02:00Z
**Priority**: high
**Status**: pending
**Area**: config

### Summary
Manual run of the final-spec daily academic report cron failed with AxiosError 400 after a 120s embedded run timeout path.

### Error
```
AxiosError: Request failed with status code 400
embedded run timeout after 120000ms
```

### Context
- Operation: forced run of cron job `每日学术报告生成`
- Job ID: `8ea696b4-3356-4190-93a2-b380a20d92ea`
- Runtime result reported by cron run history: error
- Need to inspect which downstream HTTP request in the task returns 400 and whether the prompt still relies on stale send/generation flow.

### Suggested Fix
Capture the exact failing request from logs/tool output, then update the cron task or underlying scripts to use the current PDF-only final-spec flow and validate Feishu send parameters.

### Metadata
- Reproducible: yes
- Related Files: /Users/brain/.openclaw/openclaw.json

---
