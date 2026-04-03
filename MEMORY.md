# 定时任务记录

## 1. Check embodied‑ai‑daily auto update
- **Job ID**: 6e99aa4e-c3c4-4c05-8a61-c7f92331e765
- **调度**: `0 8,12 * * *`（每天 08:00、12:00，北京时间）
- **目标**: `fullstack-dev-assistant`（isolated 会话）
- **行为**: 执行 `Check embodied‑ai‑daily auto update`，检查并更新站点 https://embodied-ai-daily.vercel.app/，完成后在 UI 中以 **announce** 方式报告。
- **状态**: 已启用，下一次运行时间 `2026-04-04 08:00`（UTC+8）。

## 说明
此任务是唯一保留的定时任务，专门负责网站的自动更新。所有其它邮件、摘要或日报相关的 cron 条目已被删除，以确保 agent 只负责网站更新。

---

*此记录已写入工作区的 `MEMORY.md`，后续可通过搜索或直接打开该文件查看。*