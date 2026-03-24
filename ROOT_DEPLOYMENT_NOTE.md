# Root vs Workspace Deployment Note

当前仓库里存在两套 Embodied AI Daily 站点文件：

- 根目录副本：`/Users/brain/.openclaw/workspace`
- 实际使用副本：`/Users/brain/.openclaw/workspace/workspaces/fullstack-dev-assistant`

## 当前约定

线上部署、GitHub Actions 采集、Vercel Root Directory，统一以：

- `workspaces/fullstack-dev-assistant`

为唯一有效目录。

## 不要再做的事

不要再把下面这些操作指向仓库根目录副本：

- 修改根目录 `data/content-items.json`
- 让 GitHub Actions 在根目录执行 `npm run ingest`
- 把 Vercel Root Directory 改回仓库根目录
- 以根目录 README / package.json / next.config.ts 作为线上依据

## 建议的后续整理

如果后面要彻底消坑，建议二选一：

1. 删除根目录重复站点副本，只保留 `workspaces/fullstack-dev-assistant`
2. 或把子目录站点迁回根目录，但要同步修改 Vercel 与 Actions

在未做彻底整理前，默认采用方案 1 的方向：

- 子目录是唯一真源（source of truth）
